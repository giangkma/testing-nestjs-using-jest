import {
    CreateCreatorPayload,
    CreatorEntity,
    getInviteCreatorEmailPayload,
} from '@src/domain/creator';
import { EmailService, EmailTemplateIds } from '@src/infra/email/email.service';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { CreateUserService } from '@src/domain/user/createUser/createUser.service';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { UserRepository } from '@src/infra/user/user.repository';
import { UserModel } from '@src/infra/database/model';

export class CreateCreatorRequestObject extends ValidRequestObject {
    constructor(
        public readonly createCreatorPayload: CreateCreatorPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        createCreatorPayload: CreateCreatorPayload,
        user: UserModel,
    ): CreateCreatorRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!createCreatorPayload) {
            invalidReq.addError('Creator info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateCreatorRequestObject(createCreatorPayload, user);
    }
}

@Injectable()
export class CreateCreatorUseCase extends UseCase<CreatorEntity> {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService,
        private createUserService: CreateUserService,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateCreatorRequestObject,
    ): Promise<CreatorEntity | ResponseFailure> {
        const { createCreatorPayload, user } = req_object;

        // check if email already exist in db
        const existUser = await this.userRepository.findByEmail(
            createCreatorPayload.email,
        );

        if (existUser) {
            return ResponseFailure.buildResourceError('Email already existed');
        }

        const result = await this.createUserService.execute(
            createCreatorPayload,
        );

        const emailData = getInviteCreatorEmailPayload(
            createCreatorPayload,
            user,
            result.initialPassword,
        );

        //TODO: implement queue for email service so user doesn't have to wait for email to be sent
        await this.emailService.sendEmail(
            createCreatorPayload.email,
            EmailTemplateIds.inviteCreator,
            emailData,
        );

        return result.user;
    }
}
