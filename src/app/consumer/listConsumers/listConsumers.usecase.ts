import { ConsumerEntity, ListConsumersPayload } from '@src/domain/consumer';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class ListConsumersRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListConsumersPayload) {
        super();
    }

    static builder(
        filter: ListConsumersPayload,
    ): ListConsumersRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListConsumersRequestObject(filter);
    }
}

@Injectable()
export class ListConsumersUseCase extends UseCase<
    ListResponseData<ConsumerEntity>
> {
    constructor(private readonly consumerRepository: ConsumerRepository) {
        super();
    }

    async processRequest(
        req_object: ListConsumersRequestObject,
    ): Promise<ListResponseData<ConsumerEntity> | ResponseFailure> {
        const { filter } = req_object;

        // return consumer entities
        const [data, count] = await this.consumerRepository.list(filter);

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
