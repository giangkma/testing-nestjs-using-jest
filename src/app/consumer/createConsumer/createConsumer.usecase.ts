import { Mapper } from '@nartc/automapper';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import StorageConfig from '@src/config/storage.config';
import {
    ConsumerEntity,
    ConsumerFollowers,
    CreateConsumerPayload,
} from '@src/domain/consumer';
import {
    formatOrganzationName,
    getOrganizationId,
} from '@src/domain/organization';
import { UserEntity, UserRole } from '@src/domain/user';
import { CreateUserService } from '@src/domain/user/createUser/createUser.service';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { UserModel } from '@src/infra/database/model';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageService } from '@src/infra/storage/storage.service';
import { plainToClass } from 'class-transformer';

export class CreateConsumerRequestObject extends ValidRequestObject {
    constructor(
        public readonly createConsumerPayload: CreateConsumerPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        createConsumerPayload: CreateConsumerPayload,
        user: UserModel,
    ): CreateConsumerRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!createConsumerPayload) {
            invalidReq.addError('Consumer info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateConsumerRequestObject(createConsumerPayload, user);
    }
}

@Injectable()
export class CreateConsumerUseCase extends UseCase<ConsumerEntity> {
    constructor(
        @Inject(StorageConfig.KEY)
        private readonly storageConfig: ConfigType<typeof StorageConfig>,

        private consumerRepository: ConsumerRepository,
        private creatorRepository: CreatorRepository,
        private organizationRepository: OrganizationRepository,
        private createUserService: CreateUserService,
        private storageService: StorageService,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateConsumerRequestObject,
    ): Promise<ConsumerEntity | ResponseFailure> {
        const { createConsumerPayload, user } = req_object;

        // check if username already exist in db
        const existConsumer = await this.consumerRepository.findByUserName(
            createConsumerPayload.username,
        );

        if (existConsumer) {
            return ResponseFailure.buildResourceError(
                'Username already existed',
            );
        }

        // map user orm to user entity
        const userEntity = Mapper.map(user, UserEntity);

        // check author before creating consumer
        switch (userEntity.role) {
            case UserRole.organization:
                // use user's id as consumer organization id if created by organization
                createConsumerPayload.organizationId = userEntity.id;
                break;
            case UserRole.creator:
            default:
                // use user's organizationId as consumer organization id if created by creator
                // and add current creator to consumer's follower
                createConsumerPayload.organizationId = user.organizationId;

                const followers: ConsumerFollowers = plainToClass(
                    ConsumerFollowers,
                    {
                        creatorIds: [userEntity.id],
                    },
                );

                createConsumerPayload.followers = followers;
                break;
        }

        const result = await this.createUserService.execute(
            createConsumerPayload,
        );

        // update coressponding creator followers
        await this.creatorRepository.assignManyConsumers(
            [userEntity.id],
            [createConsumerPayload.id],
        );

        const organization = await this.organizationRepository.findById(
            createConsumerPayload.organizationId,
        );

        // Create container Azure
        await this.storageService.getContainerClient(
            `${formatOrganzationName(organization.organizationName)}-${
                this.storageConfig.personalmedia_container
            }-${createConsumerPayload.id}`,
        );

        return result.user;
    }
}
