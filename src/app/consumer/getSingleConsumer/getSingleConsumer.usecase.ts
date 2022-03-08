import * as _ from 'lodash';

import {
    ConsumerDetailedFilterPayload,
    ConsumerEntity,
} from '@src/domain/consumer';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class GetSingleConsumerRequestObject extends ValidRequestObject {
    constructor(
        public readonly consumerId: string,
        public readonly filter: ConsumerDetailedFilterPayload,
    ) {
        super();
    }

    static builder(
        consumerId: string,
        filter: ConsumerDetailedFilterPayload,
    ): GetSingleConsumerRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!consumerId) {
            invalidReq.addError('consumer id', 'missing');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new GetSingleConsumerRequestObject(consumerId, filter);
    }
}

@Injectable()
export class GetSingleConsumerUseCase extends UseCase<
    ConsumerEntity | Partial<ConsumerEntity>
> {
    constructor(private readonly consumerRepository: ConsumerRepository) {
        super();
    }

    async processRequest(
        req_object: GetSingleConsumerRequestObject,
    ): Promise<ConsumerEntity | Partial<ConsumerEntity> | ResponseFailure> {
        const { consumerId, filter } = req_object;

        const consumer = await this.consumerRepository.findById(consumerId);

        if (!consumer) {
            throw new Error('invalid consumer');
        }

        if (filter.name) {
            return _.pick(consumer, [
                'id',
                'profile.firstName',
                'profile.lastName',
            ]);
        }

        return consumer;
    }
}
