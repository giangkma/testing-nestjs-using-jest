import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { SessionRepository } from '@src/infra/session/session.repository';
import { UseCase } from '@src/app/shared/useCase';

export class DeleteSessionRequestObject extends ValidRequestObject {
    constructor(public readonly id: string) {
        super();
    }

    static builder(
        id: string,
    ): DeleteSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Session id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteSessionRequestObject(id);
    }
}

@Injectable()
export class DeleteSessionUseCase extends UseCase<void> {
    constructor(private readonly sessionRepository: SessionRepository) {
        super();
    }

    async processRequest(
        req_object: DeleteSessionRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id } = req_object;

        const session = await this.sessionRepository.findById(id);

        if (!session) {
            ResponseFailure.buildResourceError('invalid session id');
        }

        // remove session by id
        await this.sessionRepository.deleteSession(id);

        // find all consumer sessions that has same sessionId then remove them
        await this.sessionRepository.deleteSessionConsumerBySessionId(id);

        return;
    }
}
