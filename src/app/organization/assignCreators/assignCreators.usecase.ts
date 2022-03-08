import {
    ConsumerEntity,
    UpdateConsumerFollowersPayload,
} from '@src/domain/consumer';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';

export class AssignCreatorsRequestObject extends ValidRequestObject {
    constructor(
        public readonly id: string,
        public readonly updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ): AssignCreatorsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateConsumerFollowersPayload) {
            invalidReq.addError('Creator info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new AssignCreatorsRequestObject(
            id,
            updateConsumerFollowersPayload,
        );
    }
}

@Injectable()
export class AssignCreatorsUseCase extends UseCase<ConsumerEntity> {
    constructor(
        private consumerRepository: ConsumerRepository,
        private creatorRepository: CreatorRepository,
        private nextOfKinRepository: NextOfKinRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: AssignCreatorsRequestObject,
    ): Promise<ConsumerEntity | ResponseFailure> {
        const { id, updateConsumerFollowersPayload } = req_object;

        // check if the consumer already exist in db
        const existConsumer = await this.consumerRepository.findById(id);

        if (!existConsumer) {
            throw new Error('Consumer does not exist');
        }

        const listNextOfKins = await this.nextOfKinRepository.list({
            consumerIds: [id],
        });

        const listIdsNextOfKin = listNextOfKins[0].map(
            nextOfKin => nextOfKin.id,
        );

        await Promise.all([
            // add new creators
            this.consumerRepository.assignManyCreators(
                [id],
                updateConsumerFollowersPayload.creatorIds,
            ),

            // update corresponding nextOfkin followers
            this.nextOfKinRepository.assignManyCreators(
                listIdsNextOfKin,
                updateConsumerFollowersPayload.creatorIds,
            ),

            // update corresponding creator followers
            this.creatorRepository.assignManyConsumers(
                updateConsumerFollowersPayload.creatorIds,
                [id],
            ),
            this.creatorRepository.assignManyNextOfKins(
                updateConsumerFollowersPayload.creatorIds,
                listIdsNextOfKin,
            ),
        ]);

        // get consumer info updated
        return await this.consumerRepository.findById(id);
    }
}
