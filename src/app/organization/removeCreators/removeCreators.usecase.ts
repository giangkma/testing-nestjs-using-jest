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
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';

export class RemoveCreatorsRequestObject extends ValidRequestObject {
    constructor(
        public readonly id: string,
        public readonly updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ): RemoveCreatorsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateConsumerFollowersPayload) {
            invalidReq.addError('Creator info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new RemoveCreatorsRequestObject(
            id,
            updateConsumerFollowersPayload,
        );
    }
}

@Injectable()
export class RemoveCreatorsUseCase extends UseCase<ConsumerEntity> {
    constructor(
        private consumerRepository: ConsumerRepository,
        private creatorRepository: CreatorRepository,
        private nextOfKinRepository: NextOfKinRepository,
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: RemoveCreatorsRequestObject,
    ): Promise<ConsumerEntity | ResponseFailure> {
        const { id, updateConsumerFollowersPayload } = req_object;

        const listNextOfKins = await this.nextOfKinRepository.list({
            consumerIds: [id],
        });

        const listIdsNextOfKin = listNextOfKins[0].map(
            nextOfKin => nextOfKin.id,
        );

        // check if consumer already exist in db
        const existConsumer = await this.consumerRepository.findById(id);

        if (!existConsumer) {
            throw new Error('Invalid consumer id');
        }

        await Promise.all([
            // remove creators in list
            this.consumerRepository.removeManyCreators(
                [id],
                updateConsumerFollowersPayload.creatorIds,
            ),

            // remove creators in list
            this.nextOfKinRepository.removeManyCreators(
                listIdsNextOfKin,
                updateConsumerFollowersPayload.creatorIds,
            ),

            // update corresponding creator followers
            this.creatorRepository.removeManyConsumers(
                updateConsumerFollowersPayload.creatorIds,
                [id],
            ),
            this.creatorRepository.removeManyNextOfKins(
                updateConsumerFollowersPayload.creatorIds,
                listIdsNextOfKin,
            ),
        ]);

        // find all inCompleteSession related to this creator then remove them
        await this.inCompleteSessionRepository.deleteByCreatorIdAndConsumerId(
            updateConsumerFollowersPayload.creatorIds,
            id,
        );

        // get consumer info updated
        return await this.consumerRepository.findById(id);
    }
}
