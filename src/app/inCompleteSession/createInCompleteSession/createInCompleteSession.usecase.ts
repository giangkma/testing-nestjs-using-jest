import {
    CreateInCompleteSessionInfo,
    CreateInCompleteSessionPayload,
    InCompleteSessionEntity,
} from '@src/domain/inCompleteSession';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { Injectable } from '@nestjs/common';
import { Mapper } from '@nartc/automapper';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { UserEntity } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';

export class CreateInCompleteSessionRequestObject extends ValidRequestObject {
    constructor(
        public readonly createInCompleteSessionPayload: CreateInCompleteSessionPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        createInCompleteSessionPayload: CreateInCompleteSessionPayload,
        user: UserModel,
    ): CreateInCompleteSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!user) {
            invalidReq.addError('User', 'invalid');
        }

        if (!createInCompleteSessionPayload) {
            invalidReq.addError('Session video info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateInCompleteSessionRequestObject(
            createInCompleteSessionPayload,
            user,
        );
    }
}

@Injectable()
export class CreateInCompleteSessionUseCase extends UseCase<
    InCompleteSessionEntity
> {
    constructor(
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateInCompleteSessionRequestObject,
    ): Promise<InCompleteSessionEntity | ResponseFailure> {
        const { user, createInCompleteSessionPayload } = req_object;

        // map user orm to user entity
        const userEntity = Mapper.map(user, UserEntity);

        // create incomplete session in db
        const createInCompleteSessionInfo: CreateInCompleteSessionInfo = {
            ...createInCompleteSessionPayload,
            // use user's id from request (authorization info) as author
            author: userEntity.id,
        };

        const inCompleteSessionEntity = await this.inCompleteSessionRepository.createAndSave(
            createInCompleteSessionInfo,
        );

        // return incomplete session entity
        return inCompleteSessionEntity;
    }
}
