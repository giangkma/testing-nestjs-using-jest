import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setupTestApp } from '@root/test/setup/app';
import {
    createCreatorFactory,
    CreateCreatorPayload,
} from '@src/domain/creator';
import { UserRoles, UserStatus } from '@src/domain/user';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('Create Creators', () => {
    let app: INestApplication;
    const requestCreatorData1: CreateCreatorPayload = {
        username: 'test_creator_username',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661811',
    };
    const requestCreatorData2: CreateCreatorPayload = {
        username: 'test_creator_username2',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661812',
    };
    const requestCreator1 = createCreatorFactory(requestCreatorData1);
    const requestCreator2 = createCreatorFactory(requestCreatorData2);

    beforeAll(async () => {
        // TODO: e2e test with actual test database
        const testApp = await setupTestApp();
        app = testApp;
    });

    it(`With valid required parameters`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator1)
            .expect(201);
        const { body } = response;
        expect(body).toEqual({
            ...requestCreatorData1,
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: body.createdDate,
            id: body.id,
        });
    });

    it(`With required and optional parameters`, async () => {
        const newParameters = {
            email: 'test_creator@test.com',
        };
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({ ...requestCreator2, ...newParameters })
            .expect(201);
        const { body } = response;
        expect(body).toEqual({
            ...requestCreatorData2,
            ...newParameters,
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: body.createdDate,
            id: body.id,
        });
    });

    it(`Create a Consumer that already exists`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send(requestCreator1)
            .expect(200);
        const { body } = response;
        const { error } = body;
        const expected = 'existed';
        expect(error).toEqual(expect.stringContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing username)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                profile: requestCreatorData1.profile,
                organizationId: requestCreatorData1.organizationId,
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('3 characters'),
            expect.stringContaining('string'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing profile)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                username: requestCreatorData1.username,
                organizationId: requestCreatorData1.organizationId,
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('non-empty object'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing organizationId)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                username: requestCreatorData1.username,
                profile: requestCreatorData1.profile,
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('id'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing phone number)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                profile: {
                    firstName: requestCreatorData1.profile.firstName,
                    lastName: requestCreatorData1.profile.lastName,
                },
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('phone number'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing firstName)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                profile: {
                    phoneNumber: requestCreatorData1.profile.phoneNumber,
                    lastName: requestCreatorData1.profile.lastName,
                },
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('string'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Attempt requests with missing required parameters (missing lastName)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                profile: {
                    firstName: requestCreatorData1.profile.firstName,
                    phoneNumber: requestCreatorData1.profile.phoneNumber,
                },
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [
            expect.stringContaining('string'),
            expect.stringContaining('empty'),
        ];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Invalid value for parameters (profile is tring)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                profile: 'profile',
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [expect.stringContaining('either object or array')];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Invalid value for parameters (phone number is string)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                profile: {
                    ...requestCreatorData1.profile,
                    phoneNumber: 'string',
                },
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [expect.stringContaining('phone number')];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    it(`Invalid value for parameters (organizationId wrong)`, async () => {
        const response = await request(app.getHttpServer())
            .post(`/creators`)
            .send({
                ...requestCreatorData1,
                organizationId: '123',
            })
            .expect(400);
        const { body } = response;
        const { message } = body;
        const expected = [expect.stringContaining('id')];
        expect(message).toEqual(expect.arrayContaining(expected));
    });

    afterAll(async () => {
        await app.close();
    });
});
