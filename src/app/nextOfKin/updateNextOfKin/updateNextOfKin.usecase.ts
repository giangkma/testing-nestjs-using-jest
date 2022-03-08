import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { NextOfKinEntity, UpdateNextOfKinPayload } from '@src/domain/nextOfKin';

import { Injectable } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateNextOfKinRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // nextOfKinId
        public readonly updateNextOfKinPayload: UpdateNextOfKinPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateNextOfKinPayload: UpdateNextOfKinPayload,
    ): UpdateNextOfKinRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateNextOfKinPayload) {
            invalidReq.addError('Next-of-kin info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateNextOfKinRequestObject(id, updateNextOfKinPayload);
    }
}

@Injectable()
export class UpdateNextOfKinUseCase extends UseCase<NextOfKinEntity> {
    constructor(private nextOfKinRepository: NextOfKinRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateNextOfKinRequestObject,
    ): Promise<NextOfKinEntity | ResponseFailure> {
        const { id, updateNextOfKinPayload } = req_object;

        // check if next-of-kin exist in db
        const currentNextOfKin = await this.nextOfKinRepository.findById(id);

        if (!currentNextOfKin) {
            throw new Error('Next-of-kin does not exist');
        }

        // TODO: update Azure AD B2C user
        // update next-of-kin in db
        await this.nextOfKinRepository.update(id, updateNextOfKinPayload);

        // return next-of-kin entity
        return await this.nextOfKinRepository.findById(id);
    }
}
