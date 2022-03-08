import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import {
    CreateNextOfKinPayload,
    getNextOfKinInviteEmailPayload,
    NextOfKinEntity,
} from '@src/domain/nextOfKin';
import { CreateUserService } from '@src/domain/user/createUser/createUser.service';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { UserModel } from '@src/infra/database/model';
import { EmailService, EmailTemplateIds } from '@src/infra/email/email.service';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { UserRepository } from '@src/infra/user/user.repository';

export class CreateNextOfKinRequestObject extends ValidRequestObject {
    constructor(
        public readonly createNextOfKinPayload: CreateNextOfKinPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        createNextOfKinPayload: CreateNextOfKinPayload,
        user: UserModel,
    ): CreateNextOfKinRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!createNextOfKinPayload) {
            invalidReq.addError('Next-of-kin info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateNextOfKinRequestObject(createNextOfKinPayload, user);
    }
}

@Injectable()
export class CreateNextOfKinUseCase extends UseCase<NextOfKinEntity> {
    constructor(
        private userRepository: UserRepository,
        private creatorRepository: CreatorRepository,
        private nextOfKinRepository: NextOfKinRepository,
        private consumerRepository: ConsumerRepository,
        private organizationRepository: OrganizationRepository,
        private emailService: EmailService,
        private createUserService: CreateUserService,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateNextOfKinRequestObject,
    ): Promise<NextOfKinEntity | ResponseFailure> {
        const { createNextOfKinPayload, user } = req_object;

        // check if email already exist in db
        const existUser = await this.userRepository.findByEmail(
            createNextOfKinPayload.email,
        );

        if (existUser) {
            return ResponseFailure.buildResourceError('Email already existed');
        }

        const result = await this.createUserService.execute(
            createNextOfKinPayload,
        );

        await this.consumerRepository.assignManyNextOfKins(
            createNextOfKinPayload.followers.consumerIds,
            [result.user.id],
        );

        const consumer = await this.consumerRepository.findById(
            createNextOfKinPayload.followers.consumerIds[0],
        );

        if (
            consumer.followers &&
            consumer.followers.creatorIds &&
            consumer.followers.creatorIds.length
        ) {
            // assign creator ids to next-of-kin's followers
            await this.nextOfKinRepository.assignManyCreators(
                [result.user.id],
                consumer.followers.creatorIds,
            );

            // assign nextOfKin ids to creator's followers
            await this.creatorRepository.assignManyNextOfKins(
                consumer.followers.creatorIds,
                [result.user.id],
            );
        }

        const organizationName = await this.organizationRepository.getOrganizationName(
            user,
        );

        //Send invitation mail to Next of Kin
        const emailData = getNextOfKinInviteEmailPayload(
            createNextOfKinPayload,
            user,
            consumer,
            organizationName,
            result.initialPassword,
        );

        //TODO: implement queue for email service so user doesn't have to wait for email to be sent
        await this.emailService.sendEmail(
            createNextOfKinPayload.email,
            EmailTemplateIds.inviteNextOfKin,
            emailData,
        );

        return result.user;
    }
}
