import { ConsumerEntity, ConsumerStatus, consumerInDBFactory, consumerUpdateInfoFactory } from '@src/domain/consumer';
import {
    ResponseFailure,
    ResponseSuccess,
} from '@src/app/shared/responseObject';
import { UpdateConsumerRequestObject, UpdateConsumerUseCase } from './updateConsumer.usecase'

import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { MockConsumerRepository } from '@root/test/mock/infra/consumer/consumer.repository';
import { Test } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Update consumer usecase', () => {
    let updateConsumerUseCase: UpdateConsumerUseCase;
    let consumerRepository: ConsumerRepository;

    beforeAll(async () => {
        const modulRef = await Test.createTestingModule({
            providers: [
                UpdateConsumerUseCase,
                // create mock repositories provider
                {
                    provide: getRepositoryToken(ConsumerRepository),
                    useClass: MockConsumerRepository
                }
            ]
        }).compile();

        updateConsumerUseCase = modulRef.get<UpdateConsumerUseCase>(UpdateConsumerUseCase);
        consumerRepository = modulRef.get<ConsumerRepository>(ConsumerRepository);
    });

    afterEach(() => {
        // clear mocks after each test
        jest.clearAllMocks();
    });

    const requestConsumerId = '5fcf4650ca0d90614853fe18';

    // a consumer existed instance
    const existedConsumerData = {
        id: '5ef0865a0ab5e717f2404688',
        username: 'consumer existed username',
        name: 'consumer existed name',
        status: ConsumerStatus.active,
        creatorIds: ['5fcf3b67404cd45810d095e3'],
        createdDate: new Date(),
    };

    const existedConsumerInDB = consumerInDBFactory(existedConsumerData);

    describe('execute success', () => {
        // consumer update info
        const consumerUpdateInfo = consumerUpdateInfoFactory({
            name: 'consumer name updated',
            surveyForm: {
                'schoolInfo': 'School info - test',
                'otherInfo': 'Other info - test'
            }
        });

        // updated consumer instance
        const updatedConsumerData = {
            ...existedConsumerData,
            ...consumerUpdateInfo,
            updatedDate: new Date()
        }

        const updatedConsumerInDB = consumerInDBFactory(updatedConsumerData)

        it('should return updated consumer success response', async () => {
            // consumer id exists
            jest.spyOn(consumerRepository, 'findById').mockResolvedValue(
                existedConsumerInDB,
            );

            // update consumer
            jest.spyOn(consumerRepository, 'update').mockResolvedValue(null);

            // get consumer updated
            jest.spyOn(consumerRepository, 'findById').mockResolvedValue(
                updatedConsumerInDB
            );

            const reqObj = UpdateConsumerRequestObject.builder(
                requestConsumerId,
                consumerUpdateInfo,
            );

            const executeRes = await updateConsumerUseCase.execute(reqObj);

            expect(consumerRepository.findById).toBeCalledTimes(2);
            expect(consumerRepository.findById).toBeCalledWith(
                requestConsumerId,
            );
            expect(consumerRepository.update).toBeCalledTimes(1);
            
            // expect return success response with consumer updated
            expect(executeRes).toBeInstanceOf(ResponseSuccess);
            expect(executeRes.value).toBeInstanceOf(ConsumerEntity);
            expect(classToPlain(executeRes.value)).toEqual(updatedConsumerData);
        });

        it('should return not existed error if consumer id does not exist ', async () => {
            // consumer id not found
            jest.spyOn(consumerRepository, 'findById').mockResolvedValue(
                null,
            );
            jest.spyOn(consumerRepository, 'update');

            const reqObj = UpdateConsumerRequestObject.builder(
                requestConsumerId,
                consumerUpdateInfo,
            );

            const executeRes = await updateConsumerUseCase.execute(reqObj);
            expect(consumerRepository.findById).toBeCalledTimes(1);
            expect(consumerRepository.findById).toBeCalledWith(
                requestConsumerId
            );

            // expect doesn't call update
            expect(consumerRepository.update).toBeCalledTimes(0);

            // expect response failure with error message
            expect(executeRes).toBeInstanceOf(ResponseFailure);
            // failure message existed username
            expect((executeRes as ResponseFailure).value.message).toContain(
                'Consumer does not exist',
            );
        });
    })
})
