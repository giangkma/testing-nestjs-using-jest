import {
    ConsumerEntity,
    ConsumerStatus,
    consumerCreateInfoFactory,
    consumerInDBFactory,
} from '@src/domain/consumer';
import {
    CreateConsumerRequestObject,
    CreateConsumerUseCase,
} from './createConsumer.usecase';
import {
    CreatorDataType,
    creatorEntityFactory,
} from '@src/domain/creator';
import {
    ResponseFailure,
    ResponseSuccess,
} from '@src/app/shared/responseObject';
import { UserRoles, UserStatus } from '@src/domain/user';

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { MockConsumerRepository } from '@root/test/mock/infra/consumer/consumer.repository';
import { Test } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Create consumer usecase', () => {
    let createConsumerUseCase: CreateConsumerUseCase;
    let consumerRepository: ConsumerRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateConsumerUseCase,
                // create mock repositories provider
                {
                    provide: getRepositoryToken(ConsumerRepository),
                    useClass: MockConsumerRepository,
                },
            ],
        }).compile();

        createConsumerUseCase = moduleRef.get<CreateConsumerUseCase>(CreateConsumerUseCase);
        consumerRepository = moduleRef.get<ConsumerRepository>(ConsumerRepository);
    });

    afterEach(() => {
        // clear mocks after each test
        jest.clearAllMocks();
    });

    const requestCreatorData: CreatorDataType = {
        id: '5ee34ece4f21081bb9661811',
        email: 'test_creator@test.com',
        status: UserStatus.active,
        roles: [UserRoles.creator],
        createdDate: new Date(),
    };
    const requestCreator = creatorEntityFactory(requestCreatorData);

    describe('execute success', () => {
        // consumer create info
        const consumerCreateInfo = consumerCreateInfoFactory({
            username: 'test_consumer',
            name: 'test consumer',
        });

        // new consumer instance
        const newConsumerData = {
            id: '5ef0865a0ab5e717f2404688',
            username: consumerCreateInfo.username,
            name: consumerCreateInfo.name,
            status: ConsumerStatus.active,
            creatorIds: [requestCreator.id],
            createdDate: new Date(),
        };
        const newConsumerInDB = consumerInDBFactory(newConsumerData);

        it('should return new consumer success response', async () => {
            // username not found
            jest.spyOn(consumerRepository, 'findByUserName').mockResolvedValue(
                null,
            );
            // update success
            jest.spyOn(consumerRepository, 'createAndSave').mockResolvedValue(
                newConsumerInDB,
            );

            const reqObj = CreateConsumerRequestObject.builder(
                consumerCreateInfo,
                requestCreator,
            );

            const executeRes = await createConsumerUseCase.execute(reqObj);

            expect(consumerRepository.findByUserName).toBeCalledTimes(1);
            expect(consumerRepository.findByUserName).toBeCalledWith(
                consumerCreateInfo.username,
            );
            expect(consumerRepository.createAndSave).toBeCalledTimes(1);

            // expect return success response with new consumer
            expect(executeRes).toBeInstanceOf(ResponseSuccess);
            expect(executeRes.value).toBeInstanceOf(ConsumerEntity);
            expect(classToPlain(executeRes.value)).toEqual(newConsumerData);
        });

        it('should return existed error if username existed', async () => {
            // username found
            jest.spyOn(consumerRepository, 'findByUserName').mockResolvedValue(
                newConsumerInDB,
            );
            jest.spyOn(consumerRepository, 'createAndSave');

            const reqObj = CreateConsumerRequestObject.builder(
                consumerCreateInfo,
                requestCreator,
            );

            const executeRes = await createConsumerUseCase.execute(reqObj);
            expect(consumerRepository.findByUserName).toBeCalledTimes(1);
            expect(consumerRepository.findByUserName).toBeCalledWith(
                consumerCreateInfo.username,
            );

            // expect doesn't call create and save
            expect(consumerRepository.createAndSave).toBeCalledTimes(0);

            // expect response failure with error message
            expect(executeRes).toBeInstanceOf(ResponseFailure);
            // failure message existed username
            expect((executeRes as ResponseFailure).value.message).toContain(
                'existed',
            );
        });
    });
});
