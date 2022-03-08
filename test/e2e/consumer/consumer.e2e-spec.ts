import * as request from 'supertest';

import { ConsumerEntity, ConsumerStatus } from '@src/domain/consumer';
import {
    ResponseFailure,
    ResponseSuccess,
} from '@src/app/shared/responseObject';

import APIConfig from '@src/config/api.config';
import { ConfigType } from '@nestjs/config';
import { ConsumerModule } from '@src/interfaces/http/rest/api_v1/consumer/consumer.module';
import { CreateConsumerUseCase } from '@src/app/consumer/createConsumer/createConsumer.usecase';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';

describe('Consumers', () => {
    let app: INestApplication;
    let apiConfig: ConfigType<typeof APIConfig>;
    // let createConsumerUseCase: CreateConsumerUseCase;

    // new consumer instance
    const newConsumer = new ConsumerEntity();
    newConsumer.id = '123';
    newConsumer.creatorIds = ['456'];
    newConsumer.username = 'test1';
    newConsumer.name = 'tester';
    newConsumer.status = ConsumerStatus.inactive;
    newConsumer.createdDate = new Date();

    beforeAll(async () => {
        try {
            // TODO: e2e test with actual test database
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            }).compile();
    
            app = moduleRef.createNestApplication();
    
            // createConsumerUseCase = moduleRef.get<CreateConsumerUseCase>(CreateConsumerUseCase);
    
            // get api and app config
            apiConfig = await app.get<string, ConfigType<typeof APIConfig>>(
                APIConfig.KEY,
            );
    
            await app.init();
        } catch (e) {
            console.log('>>>> eororor', e)
        }
    });

    it(`/POST consumer`, async () => {
        // mocke create consumer use case success
        const result = new ResponseSuccess(newConsumer);
        // jest.spyOn(createConsumerUseCase, 'execute').mockImplementationOnce(
        //     async () => result,
        // );

        return request(app.getHttpServer())
            .post(`${apiConfig.api_v1}/consumers`)
            .send({})
            .expect(200)
            .expect({
                data: result,
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
