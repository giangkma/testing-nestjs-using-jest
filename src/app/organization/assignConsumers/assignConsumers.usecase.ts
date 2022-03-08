import {
    CreatorEntity,
    UpdateCreatorFollowersPayload,
} from '@src/domain/creator';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class AssignConsumersRequestObject extends ValidRequestObject {
    constructor(
        public readonly id: string,
        public readonly updateCreatorFollowersPayload: UpdateCreatorFollowersPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateCreatorFollowersPayload: UpdateCreatorFollowersPayload,
    ): AssignConsumersRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateCreatorFollowersPayload) {
            invalidReq.addError('Consumer info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new AssignConsumersRequestObject(
            id,
            updateCreatorFollowersPayload,
        );
    }
}

@Injectable()
export class AssignConsumersUseCase extends UseCase<CreatorEntity> {
    constructor(
        private creatorRepository: CreatorRepository,
        private consumerRepository: ConsumerRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: AssignConsumersRequestObject,
    ): Promise<CreatorEntity | ResponseFailure> {
        const { id, updateCreatorFollowersPayload } = req_object;

        // check if the creator already exist in db
        const existCreator = await this.creatorRepository.findById(id);

        if (!existCreator) {
            throw new Error('Creator does not exist');
        }

        await Promise.all([
            // add new consumer
            this.creatorRepository.assignManyConsumers(
                [id],
                updateCreatorFollowersPayload.consumerIds,
            ),

            // update corresponding consumer followers
            this.consumerRepository.assignManyCreators(
                updateCreatorFollowersPayload.consumerIds,
                [id],
            ),
        ]);

        // get creator info updated
        return await this.creatorRepository.findById(id);
    }
}
