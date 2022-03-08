import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import StorageConfig from '@src/config/storage.config';
import { CreatorEntity } from '@src/domain/creator/creator.entity';
import { formatOrganzationName } from '@src/domain/organization';
import { MSALService } from '@src/infra/auth/msal.service';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageService } from '@src/infra/storage/storage.service';

export class DeleteConsumerRequestObject extends ValidRequestObject {
    constructor(
        public readonly id: string,
        public readonly creator: CreatorEntity,
    ) {
        super();
    }

    static builder(
        id: string,
        creator: CreatorEntity,
    ): DeleteConsumerRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!creator) {
            invalidReq.addError('Creator', 'invalid');
        }

        if (!id) {
            invalidReq.addError('Consumer id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteConsumerRequestObject(id, creator);
    }
}

@Injectable()
export class DeleteConsumerUseCase extends UseCase<void> {
    constructor(
        @Inject(StorageConfig.KEY)
        private readonly storageConfig: ConfigType<typeof StorageConfig>,

        private organizationRepository: OrganizationRepository,
        private readonly consumerRepository: ConsumerRepository,
        private readonly nextOfKinRepository: NextOfKinRepository,
        private readonly creatorRepository: CreatorRepository,
        private readonly inCompleteSessionRepository: InCompleteSessionRepository,
        private msalService: MSALService,
        private storageService: StorageService,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteConsumerRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id } = req_object;

        const consumer = await this.consumerRepository.findById(id);

        if (!consumer) {
            throw new Error('invalid Consumer id');
        }

        // TODO: delete 7Digital user

        // delete Azure AD B2C user
        await this.msalService.deleteB2CUser(id);

        await this.consumerRepository.delete(id);

        // find all inCompleteSession related to this consumer then remove them
        await this.inCompleteSessionRepository.deleteByConsumerId(id);

        const organization = await this.organizationRepository.findById(
            consumer.organizationId,
        );

        // delete container azure
        await this.storageService.deleteContainerClient(
            `${formatOrganzationName(organization.organizationName)}-${
                this.storageConfig.personalmedia_container
            }-${consumer.id}`,
        );

        // delete consumer ids from list followers of organization
        await this.organizationRepository.removeConsumer(
            consumer.organizationId,
            consumer.id,
        );

        // remove consumer ids from list followers
        if (consumer.followers) {
            // of nextOfKin
            if (
                consumer.followers.nextOfKinIds &&
                consumer.followers.nextOfKinIds.length
            ) {
                await this.nextOfKinRepository.removeManyConsumers(
                    consumer.followers.nextOfKinIds,
                    [consumer.id],
                );
            }
            // of creator
            if (
                consumer.followers.creatorIds &&
                consumer.followers.creatorIds.length
            ) {
                await this.creatorRepository.removeManyConsumers(
                    consumer.followers.creatorIds,
                    [consumer.id],
                );
            }
        }

        return;
    }
}
