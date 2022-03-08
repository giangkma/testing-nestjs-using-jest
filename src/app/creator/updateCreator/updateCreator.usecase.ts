import * as _ from 'lodash';

import { CreatorEntity, UpdateCreatorPayload } from '@src/domain/creator';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateCreatorRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // creatorId
        public readonly updateCreatorPayload: UpdateCreatorPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateCreatorPayload: UpdateCreatorPayload,
    ): UpdateCreatorRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();
        if (_.isEmpty(updateCreatorPayload)) {
            invalidReq.addError('Creator info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateCreatorRequestObject(id, updateCreatorPayload);
    }
}

@Injectable()
export class UpdateCreatorUseCase extends UseCase<CreatorEntity> {
    constructor(private creatorRepository: CreatorRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateCreatorRequestObject,
    ): Promise<CreatorEntity | ResponseFailure> {
        const { id, updateCreatorPayload } = req_object;

        // check if creator exist in db
        const currentCreator = await this.creatorRepository.findById(id);

        if (!currentCreator) {
            throw new Error('Creator does not exist');
        }

        // update creator in db
        await this.creatorRepository.update(id, updateCreatorPayload);

        // get creator info updated
        return await this.creatorRepository.findById(id);
    }
}
