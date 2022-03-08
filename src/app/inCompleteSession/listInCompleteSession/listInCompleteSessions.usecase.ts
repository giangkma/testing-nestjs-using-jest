import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { ListResponseData } from '@src/domain/helper/base.dto';
import {
    InCompleteSessionEntity,
    ListInCompleteSessionsPayload,
} from '@src/domain/inCompleteSession';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';

export class ListInCompleteSessionsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListInCompleteSessionsPayload) {
        super();
    }

    static builder(
        filter: ListInCompleteSessionsPayload,
    ): ListInCompleteSessionsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListInCompleteSessionsRequestObject(filter);
    }
}

@Injectable()
export class ListInCompleteSessionsUseCase extends UseCase<
    ListResponseData<InCompleteSessionEntity>
> {
    constructor(
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: ListInCompleteSessionsRequestObject,
    ): Promise<ListResponseData<InCompleteSessionEntity> | ResponseFailure> {
        const { filter } = req_object;

        // return consumer entities
        const [data, count] = await this.inCompleteSessionRepository.list(
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
