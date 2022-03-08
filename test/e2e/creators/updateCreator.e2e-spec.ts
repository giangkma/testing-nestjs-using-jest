import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setupTestApp } from '@root/test/setup/app';
import {
    createCreatorFactory,
    CreateCreatorPayload,
} from '@src/domain/creator';
import { UserRoles, UserStatus } from '@src/domain/user';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('Update Creators', () => {
    let app: INestApplication;

    const fakeCreatorId = '5fcf4650ca0d90614853fe18';

    const requestCreatorData1: CreateCreatorPayload = {
        username: 'test_creator_username',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661811',
    };
    const requestCreator1 = createCreatorFactory(requestCreatorData1);
    const requestBody = {
        username: 'username',
        profile: {
            firstName: 'first_name',
        },
    };
    let creator = null;

    beforeAll(async () => {
        // TODO: e2e test with actual test database
        const testApp = await setupTestApp();
        app = testApp;

        creator = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator1);
    });

    it(`Update username and firstName`, async () => {
        const response = await request(app.getHttpServer())
            .patch(`/creators/${creator.body.id}`)
            .send(requestBody)
            .expect(200);
        const { body } = response;
        expect(body).toEqual({
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: body.createdDate,
            updatedDate: body.updatedDate,
            username: requestBody.username,
            profile: {
                ...requestCreator1.profile,
                ...requestBody.profile,
            },
            organizationId: requestCreator1.organizationId,
            id: body.id,
        });
    });

    it(`Update for Invalid Values parameters`, async () => {
        const response = await request(app.getHttpServer())
            .patch(`/creators/${creator.body.id}`)
            .send({ username: { title: 'username' } })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('3 characters'),
            expect.stringContaining('string'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Update for No Creator Info`, async () => {
        const response = await request(app.getHttpServer())
            .patch(`/creators/${creator.body.id}`)
            .send()
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = 'invalid';
        expect(message).toEqual(expect.stringContaining(expected));
    });

    it(`Update creator id does not exist`, async () => {
        const response = await request(app.getHttpServer())
            .patch(`/creators/${fakeCreatorId}`)
            .send(requestBody)
            .expect(500);
        const { body } = response;
        const { message } = body;
        const expected = 'not exist';
        expect(message).toEqual(expect.stringContaining(expected));
    });

    afterAll(async () => {
        await app.close();
    });
});
