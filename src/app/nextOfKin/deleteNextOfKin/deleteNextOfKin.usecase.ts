import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { MSALService } from '@src/infra/auth/msal.service';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';

export class DeleteNextOfKinRequestObject extends ValidRequestObject {
    constructor(public readonly id: string) {
        super();
    }

    static builder(
        id: string,
    ): DeleteNextOfKinRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Next-of-kin id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteNextOfKinRequestObject(id);
    }
}

@Injectable()
export class DeleteNextOfKinUseCase extends UseCase<void> {
    constructor(
        private readonly nextOfKinRepository: NextOfKinRepository,
        private readonly consumerRepository: ConsumerRepository,
        private readonly creatorRepository: CreatorRepository,
        private msalService: MSALService,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteNextOfKinRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id } = req_object;

        const nextOfKin = await this.nextOfKinRepository.findById(id);

        if (!nextOfKin) {
            throw new Error('invalid Next-of-kin id');
        }

        // remove next-of-kin id from list followers
        if (nextOfKin.followers) {
            // of consumer
            if (
                nextOfKin.followers.consumerIds &&
                nextOfKin.followers.consumerIds.length
            ) {
                await this.consumerRepository.removeManyNextOfKins(
                    nextOfKin.followers.consumerIds,
                    [nextOfKin.id],
                );
            }

            // of creator
            if (
                nextOfKin.followers.creatorIds &&
                nextOfKin.followers.creatorIds.length
            ) {
                await this.creatorRepository.removeManyNextOfKins(
                    nextOfKin.followers.creatorIds,
                    [nextOfKin.id],
                );
            }
        }

        // delete Azure AD B2C user
        await this.msalService.deleteB2CUser(id);

        await this.nextOfKinRepository.delete(id);

        return;
    }
}
