import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import StorageConfig from '@src/config/storage.config';
import {
    CreateOrganizationPayload,
    formatOrganzationName,
    getInviteOrganizationEmailPayload,
    OrganizationEntity,
} from '@src/domain/organization';
import { CreateUserService } from '@src/domain/user/createUser/createUser.service';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';
import { UserModel } from '@src/infra/database/model';
import { EmailService, EmailTemplateIds } from '@src/infra/email/email.service';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageService } from '@src/infra/storage/storage.service';
import { UserRepository } from '@src/infra/user/user.repository';

export class CreateOrganizationRequestObject extends ValidRequestObject {
    constructor(
        public readonly createOrganizationPayload: CreateOrganizationPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        createOrganizationPayload: CreateOrganizationPayload,
        user: UserModel,
    ): CreateOrganizationRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!createOrganizationPayload) {
            invalidReq.addError('Organization info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateOrganizationRequestObject(
            createOrganizationPayload,
            user,
        );
    }
}

@Injectable()
export class CreateOrganizationUseCase extends UseCase<OrganizationEntity> {
    constructor(
        @Inject(StorageConfig.KEY)
        private readonly storageConfig: ConfigType<typeof StorageConfig>,

        private userRepository: UserRepository,
        private organizationRepository: OrganizationRepository,
        private adminRepository: AdminRepository,
        private emailService: EmailService,
        private createUserService: CreateUserService,
        private storageService: StorageService,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateOrganizationRequestObject,
    ): Promise<OrganizationEntity | ResponseFailure> {
        const { createOrganizationPayload, user } = req_object;

        // check if email already exist in db
        const existEmail = await this.userRepository.findByEmail(
            createOrganizationPayload.email,
        );

        if (existEmail) {
            return ResponseFailure.buildResourceError('Email already existed');
        }

        // check if org name already exist in db
        const existName = await this.organizationRepository.findByOrganizationName(
            createOrganizationPayload.organizationName,
        );

        if (existName) {
            return ResponseFailure.buildResourceError(
                'Organization name already existed',
            );
        }

        const result = await this.createUserService.execute(
            createOrganizationPayload,
        );

        //Send invitation mail to Organization
        const emailData = getInviteOrganizationEmailPayload(
            createOrganizationPayload,
            result.initialPassword,
        );

        //TODO: implement queue for email service so user doesn't have to wait for email to be sent
        await this.emailService.sendEmail(
            createOrganizationPayload.email,
            EmailTemplateIds.inviteOrganization,
            emailData,
        );

        const organizationNameFormated = formatOrganzationName(
            createOrganizationPayload.organizationName,
        );

        // Create containers on Azure
        await this.storageService.getContainerClient(
            `${organizationNameFormated}-${this.storageConfig.avatars_container}`,
        );

        await this.storageService.getContainerClient(
            `${organizationNameFormated}-${this.storageConfig.commonmedia_container}`,
        );

        await this.adminRepository.assignOrganization(user._id, result.user.id);

        return result.user;
    }
}
