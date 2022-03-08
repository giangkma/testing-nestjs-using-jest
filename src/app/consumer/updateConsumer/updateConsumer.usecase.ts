import * as _ from 'lodash';

import { ConsumerEntity, UpdateConsumerPayload } from '@src/domain/consumer';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateConsumerRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // consumer id
        public readonly updateConsumerPayload: UpdateConsumerPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateConsumerPayload: UpdateConsumerPayload,
    ): UpdateConsumerRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateConsumerPayload) {
            invalidReq.addError('Consumer info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateConsumerRequestObject(id, updateConsumerPayload);
    }
}

@Injectable()
export class UpdateConsumerUseCase extends UseCase<ConsumerEntity> {
    constructor(private consumerRepository: ConsumerRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateConsumerRequestObject,
    ): Promise<ConsumerEntity | ResponseFailure> {
        const { id, updateConsumerPayload } = req_object;

        // check if consumer exist in db
        const currentConsumer = await this.consumerRepository.findById(id);

        if (!currentConsumer) {
            throw new Error('Consumer does not exist');
        }

        // TODO: update Azure AD B2C user
        // update consumer in db
        await this.consumerRepository.update(
            id,
            updateConsumerPayload,
            currentConsumer,
        );

        // return consumer entity
        return await this.consumerRepository.findById(id);
    }
}
