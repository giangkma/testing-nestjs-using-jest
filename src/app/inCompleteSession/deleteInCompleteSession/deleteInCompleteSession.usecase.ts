import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { UserModel } from '@src/infra/database/model';

export class DeleteInCompleteSessionRequestObject extends ValidRequestObject {
    constructor(public readonly id: string, public readonly user: UserModel) {
        super();
    }

    static builder(
        id: string,
        user: UserModel,
    ): DeleteInCompleteSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Session video id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteInCompleteSessionRequestObject(id, user);
    }
}

@Injectable()
export class DeleteInCompleteSessionUseCase extends UseCase<void> {
    constructor(
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteInCompleteSessionRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id, user } = req_object;

        const inCompleteSession = await this.inCompleteSessionRepository.findById(
            id,
        );

        if (!inCompleteSession) {
            throw new Error('invalid session video id');
        }

        // ensure a creator/organization who was creating a session video can be delete it
        if (user._id !== inCompleteSession.author) {
            throw new Error('You do not have permission');
        }

        await this.inCompleteSessionRepository.delete(id);

        return;
    }
}
