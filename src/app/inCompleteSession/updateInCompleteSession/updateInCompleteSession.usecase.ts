import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import {
    InCompleteSessionEntity,
    UpdateInCompleteSessionPayload,
} from '@src/domain/inCompleteSession';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import * as _ from 'lodash';

export class UpdateInCompleteSessionRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // session id
        public readonly updateInCompleteSessionPayload: UpdateInCompleteSessionPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateInCompleteSessionPayload: UpdateInCompleteSessionPayload,
    ): UpdateInCompleteSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();
        if (_.isEmpty(updateInCompleteSessionPayload)) {
            invalidReq.addError('In complete Session info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateInCompleteSessionRequestObject(
            id,
            updateInCompleteSessionPayload,
        );
    }
}

@Injectable()
export class UpdateInCompleteSessionUseCase extends UseCase<
    InCompleteSessionEntity
> {
    constructor(
        private inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: UpdateInCompleteSessionRequestObject,
    ): Promise<InCompleteSessionEntity | ResponseFailure> {
        const { id, updateInCompleteSessionPayload } = req_object;

        // check if session exist in db
        const currentInCompleteSession = await this.inCompleteSessionRepository.findById(
            id,
        );

        if (!currentInCompleteSession) {
            return ResponseFailure.buildResourceError(
                'In complete Session does not exist',
            );
        }

        // update session in db
        await this.inCompleteSessionRepository.update(
            id,
            updateInCompleteSessionPayload,
        );

        // get session info updated
        return await this.inCompleteSessionRepository.findById(id);
    }
}
