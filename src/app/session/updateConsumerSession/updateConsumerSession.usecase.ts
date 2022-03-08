import * as _ from 'lodash';

import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    SessionConsumerEntity,
    UpdateConsumerSessionPayload,
} from '@src/domain/session';

import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { SessionRepository } from '@src/infra/session/session.repository';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateConsumerSessionRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // session consumer id
        public readonly updateConsumerSessionPayload: UpdateConsumerSessionPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateConsumerSessionPayload: UpdateConsumerSessionPayload,
    ): UpdateConsumerSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();
        if (_.isEmpty(updateConsumerSessionPayload)) {
            invalidReq.addError('Session info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateConsumerSessionRequestObject(
            id,
            updateConsumerSessionPayload,
        );
    }
}

@Injectable()
export class UpdateConsumerSessionUseCase extends UseCase<
    SessionConsumerEntity
> {
    constructor(private sessionRepository: SessionRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateConsumerSessionRequestObject,
    ): Promise<SessionConsumerEntity | ResponseFailure> {
        const { id, updateConsumerSessionPayload } = req_object;

        // check if consumer session exist in db
        const currentConsumerSession = await this.sessionRepository.findConsumerSessionById(
            id,
        );

        if (!currentConsumerSession) {
            return ResponseFailure.buildResourceError(
                'Consumer Session does not exist',
            );
        }

        // update consumer session in db
        await this.sessionRepository.updateConsumerSession(
            id,
            updateConsumerSessionPayload,
        );

        // get consumer session info updated
        return await this.sessionRepository.findConsumerSessionById(id);
    }
}
