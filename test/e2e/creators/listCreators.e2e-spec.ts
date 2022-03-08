import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setupTestApp } from '@root/test/setup/app';
import {
    createCreatorFactory,
    CreateCreatorPayload,
} from '@src/domain/creator';
import { UserRoles, UserStatus } from '@src/domain/user';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('List Creators', () => {
    let app: INestApplication;
    const usernameCreatorNotExisted = 'creator_username_not_exited';

    const requestCreatorData1: CreateCreatorPayload = {
        username: 'test_creator_username',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        email: 'test_creator@test.com',
        organizationId: '5ee34ece4f21081bb9661111',
    };
    const requestCreatorData2: CreateCreatorPayload = {
        username: 'test_creator_username2',
        profile: {
            firstName: 'creator_first_name2',
            lastName: 'creator_last_name2',
            phoneNumber: '4762980018',
        },
        email: 'test_creator2@test.com',
        organizationId: '5ee34ece4f21081bb9661222',
    };
    const requestCreator1 = createCreatorFactory(requestCreatorData1);
    const requestCreator2 = createCreatorFactory(requestCreatorData2);

    beforeAll(async () => {
        // TODO: e2e test with actual test database
        const testApp = await setupTestApp();
        app = testApp;
    });

    it(`List all creators, no filter`, async () => {
        const creator1 = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator1);
        const creator2 = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator2);
        const response = await request(app.getHttpServer())
            .get(`/creators`)
            .expect(200);
        expect(response.body).toEqual({
            data: [
                {
                    ...requestCreatorData1,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: creator1.body.createdDate,
                    id: creator1.body.id,
                },
                {
                    ...requestCreatorData2,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: creator2.body.createdDate,
                    id: creator2.body.id,
                },
            ],
            info: {
                total: 2,
            },
        });
    });

    it(`Filter username, email creator`, async () => {
        const query = {
            username: requestCreatorData1.username,
            email: requestCreatorData1.email,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?username=${query.username}&email=${query.email}`)
            .expect(200);
        const { body } = response;
        const { data } = body;
        expect(body).toEqual({
            data: [
                {
                    ...requestCreatorData1,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: data[0].createdDate,
                    id: data[0].id,
                },
            ],
            info: {
                total: 1,
            },
        });
    });

    it(`Filter username creator`, async () => {
        const query = {
            username: requestCreatorData1.username,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?username=${query.username}`)
            .expect(200);
        const { body } = response;
        const { data } = body;
        expect(body).toEqual({
            data: [
                {
                    ...requestCreatorData1,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: data[0].createdDate,
                    id: data[0].id,
                },
            ],
            info: {
                total: 1,
            },
        });
    });

    it(`Filter email creator`, async () => {
        const query = {
            email: requestCreatorData2.email,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?email=${query.email}`)
            .expect(200);
        const { body } = response;
        const { data } = body;
        expect(body).toEqual({
            data: [
                {
                    ...requestCreatorData2,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: data[0].createdDate,
                    id: data[0].id,
                },
            ],
            info: {
                total: 1,
            },
        });
    });

    it(`Filter firstName creator`, async () => {
        const query = {
            firstName: requestCreatorData2.profile.firstName,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?firstName=${query.firstName}`)
            .expect(200);
        const { body } = response;
        const { data } = body;
        expect(body).toEqual({
            data: [
                {
                    ...requestCreatorData2,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: data[0].createdDate,
                    id: data[0].id,
                },
            ],
            info: {
                total: 1,
            },
        });
    });

    it(`Filter phoneNumber creator`, async () => {
        const query = {
            phoneNumber: requestCreatorData1.profile.phoneNumber,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?phoneNumber=${query.phoneNumber}`)
            .expect(200);
        const { body } = response;
        const { data } = body;
        expect(body).toEqual({
            data: [
                {
                    ...requestCreatorData1,
                    status: UserStatus.active,
                    roles: [UserRoles.creator],
                    createdDate: data[0].createdDate,
                    id: data[0].id,
                },
            ],
            info: {
                total: 1,
            },
        });
    });

    it(`Filter username not existed`, async () => {
        const query = {
            username: usernameCreatorNotExisted,
        };
        const response = await request(app.getHttpServer())
            .get(`/creators?username=${query.username}`)
            .expect(200);
        const { body } = response;
        expect(body).toEqual({
            data: [],
            info: {
                total: 0,
            },
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
