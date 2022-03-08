import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { SessionEntity, SessionListPayload } from '@src/domain/session';

import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { SessionRepository } from '@src/infra/session/session.repository';
import { UseCase } from '@src/app/shared/useCase';

export class ListSessionsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: SessionListPayload) {
        super();
    }

    static builder(
        filter: SessionListPayload,
    ): ListSessionsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListSessionsRequestObject(filter);
    }
}

@Injectable()
export class ListSessionsUseCase extends UseCase<
    ListResponseData<SessionEntity>
> {
    constructor(private readonly sessionRepository: SessionRepository) {
        super();
    }

    async processRequest(
        req_object: ListSessionsRequestObject,
    ): Promise<ListResponseData<SessionEntity> | ResponseFailure> {
        const { filter } = req_object;

        // The 'consumerId' property does not belong to Session model (it belongs to ConsumerSession)
        // So should get all consumer sessions which have same filter.consumerId
        // Then find list sessions by ids & other filters
        if (filter.consumerId) {
            const [
                consumerSessions,
                count,
            ] = await this.sessionRepository.listConsumerSessions({
                consumerIds: [filter.consumerId],
            });

            // return empty data if no documents match
            if (count < 1) {
                return {
                    data: [],
                    info: {
                        total: 0,
                        pageSize: filter.limit,
                        pageIndex: filter.pageIndex,
                    },
                };
            }

            // Add 'sessionIds' to filter parameters
            filter.sessionIds = consumerSessions.map(s => s.sessionId);
        }

        // get list sessions entities
        const [data, count] = await this.sessionRepository.list(filter);

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
