import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    ListConsumerSessionsPayload,
    SessionConsumerEntity,
} from '@src/domain/session';

import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { SessionRepository } from '@src/infra/session/session.repository';
import { UseCase } from '@src/app/shared/useCase';

export class ListConsumerSessionsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListConsumerSessionsPayload) {
        super();
    }

    static builder(
        filter: ListConsumerSessionsPayload,
    ): ListConsumerSessionsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListConsumerSessionsRequestObject(filter);
    }
}

@Injectable()
export class ListConsumerSessionsUseCase extends UseCase<
    ListResponseData<SessionConsumerEntity>
> {
    constructor(private readonly sessionRepository: SessionRepository) {
        super();
    }

    async processRequest(
        req_object: ListConsumerSessionsRequestObject,
    ): Promise<ListResponseData<SessionConsumerEntity> | ResponseFailure> {
        const { filter } = req_object;

        // get list session consumers entities
        const [data, count] = await this.sessionRepository.listConsumerSessions(
            filter,
        );

        return {
            data,
            info: {
                total: count,
                pageSize: filter.limit,
                pageIndex: filter.pageIndex,
            },
        };
    }
}
