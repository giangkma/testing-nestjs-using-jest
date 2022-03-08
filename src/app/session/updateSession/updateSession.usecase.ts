import * as _ from 'lodash';

import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { SessionEntity, UpdateSessionPayload } from '@src/domain/session';

import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { SessionRepository } from '@src/infra/session/session.repository';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateSessionRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // session id
        public readonly updateSessionPayload: UpdateSessionPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateSessionPayload: UpdateSessionPayload,
    ): UpdateSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();
        if (_.isEmpty(updateSessionPayload)) {
            invalidReq.addError('Session info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateSessionRequestObject(id, updateSessionPayload);
    }
}

@Injectable()
export class UpdateSessionUseCase extends UseCase<SessionEntity> {
    constructor(private sessionRepository: SessionRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateSessionRequestObject,
    ): Promise<SessionEntity | ResponseFailure> {
        const { id, updateSessionPayload } = req_object;

        // check if session exist in db
        const currentSession = await this.sessionRepository.findById(id);

        if (!currentSession) {
            return ResponseFailure.buildResourceError('Session does not exist');
        }

        // update session in db
        await this.sessionRepository.updateSession(
            id,
            updateSessionPayload,
            currentSession,
        );

        // get session info updated
        return await this.sessionRepository.findById(id);
    }
}
