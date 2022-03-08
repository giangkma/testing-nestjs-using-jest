import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { InCompleteSessionEntity } from '@src/domain/inCompleteSession';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class GetSingleInCompleteSessionRequestObject extends ValidRequestObject {
    constructor(public readonly id: string) {
        super();
    }

    static builder(
        id: string,
    ): GetSingleInCompleteSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('session video id', 'missing');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new GetSingleInCompleteSessionRequestObject(id);
    }
}

@Injectable()
export class GetSingleInCompleteSessionUseCase extends UseCase<
    InCompleteSessionEntity
> {
    constructor(
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: GetSingleInCompleteSessionRequestObject,
    ): Promise<InCompleteSessionEntity | ResponseFailure> {
        const { id } = req_object;

        const inCompleteSession = await this.inCompleteSessionRepository.findById(
            id,
        );

        if (!inCompleteSession) {
            throw new Error('invalid session video');
        }

        return inCompleteSession;
    }
}
