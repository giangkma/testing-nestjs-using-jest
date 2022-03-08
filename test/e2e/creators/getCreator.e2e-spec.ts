import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setupTestApp } from '@root/test/setup/app';
import {
    createCreatorFactory,
    CreateCreatorPayload,
} from '@src/domain/creator';
import { UserRoles, UserStatus } from '@src/domain/user';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('Get Creators', () => {
    let app: INestApplication;

    const requestCreatorData: CreateCreatorPayload = {
        username: 'test_creator_username',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661811',
    };
    const requestCreator = createCreatorFactory(requestCreatorData);

    beforeAll(async () => {
        // TODO: e2e test with actual test database
        const testApp = await setupTestApp();
        app = testApp;
    });

    it(`With required parameters is formatted incorrectly`, async () => {
        const id_filter = '123';

        const response = await request(app.getHttpServer())
            .get(`/creators/${id_filter}`)
            .expect(500);
        const { body } = response;
        const { message } = body;
        const expected = 'a string of 24 hex characters';
        expect(message).toEqual(expect.stringContaining(expected));
    });

    it(`With require parameters`, async () => {
        // create new creator
        const response1 = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator);
        // get creator by id
        const response2 = await request(app.getHttpServer())
            .get(`/creators/${response1.body.id}`)
            .expect(200);
        const { body } = response2;
        expect(body).toEqual({
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: body.createdDate,
            id: body.id,
            ...requestCreator,
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
