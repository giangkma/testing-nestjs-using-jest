import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { MSALService } from '@src/infra/auth/msal.service';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';

export class DeleteCreatorRequestObject extends ValidRequestObject {
    constructor(public readonly id: string) {
        super();
    }

    static builder(
        id: string,
    ): DeleteCreatorRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Creator id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteCreatorRequestObject(id);
    }
}

@Injectable()
export class DeleteCreatorUseCase extends UseCase<void> {
    constructor(
        private readonly creatorRepository: CreatorRepository,
        private readonly consumerRepository: ConsumerRepository,
        private readonly nextOfKinRepository: NextOfKinRepository,
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
        private msalService: MSALService,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteCreatorRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id } = req_object;

        const creator = await this.creatorRepository.findById(id);

        if (!creator) {
            throw new Error('Invalid creator id');
        }

        // delete Azure AD B2C user
        await this.msalService.deleteB2CUser(id);

        await this.creatorRepository.delete(id);

        // find all inCompleteSession related to this creator then remove them
        await this.inCompleteSessionRepository.deleteByCreatorId(id);

        // remove creator ids from list followers
        if (creator.followers) {
            // of consumer
            if (
                creator.followers.consumerIds &&
                creator.followers.consumerIds.length
            ) {
                await this.consumerRepository.removeManyCreators(
                    creator.followers.consumerIds,
                    [creator.id],
                );
            }

            // of next-of-kin
            if (
                creator.followers.nextOfKinIds &&
                creator.followers.nextOfKinIds.length
            ) {
                await this.nextOfKinRepository.removeManyCreators(
                    creator.followers.nextOfKinIds,
                    [creator.id],
                );
            }
        }

        return;
    }
}
