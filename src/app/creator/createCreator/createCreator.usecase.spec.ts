import {
    CreateCreatorPayload,
    CreatorEntity,
    createCreatorFactory,
    creatorInDBFactory
} from '@src/domain/creator';
import {
    CreateCreatorRequestObject,
    CreateCreatorUseCase,
} from './createCreator.usecase';
import {
    ResponseFailure,
    ResponseSuccess,
} from '@src/app/shared/responseObject';
import { UserRoles, UserStatus } from '@src/domain/user';

import { AuthService } from '@src/infra/auth/auth.service';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { MockAuthService, } from '@root/test/mock/infra/auth/auth.service';
import { MockCreatorRepository } from '@root/test/mock/infra/creator/creator.repository';
import { Test } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Create creator usecase', () => {
    let createCreatorUseCase: CreateCreatorUseCase;
    let creatorRepository: CreatorRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateCreatorUseCase,
                // create mock repositories provider
                {
                    provide: getRepositoryToken(CreatorRepository),
                    useClass: MockCreatorRepository,
                },
                {
                    provide: AuthService,
                    useClass: MockAuthService
                }
            ],
        }).compile();

        createCreatorUseCase = moduleRef.get<CreateCreatorUseCase>(CreateCreatorUseCase);
        creatorRepository = moduleRef.get<CreatorRepository>(CreatorRepository);
    });

    afterEach(() => {
        // clear mocks after each test
        jest.clearAllMocks();
    });

    const requestCreatorData: CreateCreatorPayload = {
        username: 'test_creator_username',
        email: 'test_creator@test.com',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661811',
        createdDate: new Date(),
    };

    const requestCreator = createCreatorFactory(requestCreatorData);

    describe('execute success', () => {
        // new creator instance
        const newCreatorData = {
            ...requestCreator,
            id: '5f61b55913507b0026d277c8',
            hashedPassword: 'hashed_password',
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: new Date(),
        };
        const newCreatorInDB = creatorInDBFactory(newCreatorData);

        it('should return new creator success response', async () => {
            // email not found
            jest.spyOn(creatorRepository, 'findByUserName').mockResolvedValue(
                null
            );

            // create creator
            jest.spyOn(creatorRepository, 'createAndSave').mockResolvedValue(
                newCreatorInDB,
            );

            const reqObj = CreateCreatorRequestObject.builder(requestCreatorData);

            const executeRes = await createCreatorUseCase.execute(reqObj);
            expect(creatorRepository.createAndSave).toBeCalledTimes(1);

            // expect return success response with new user
            expect(executeRes).toBeInstanceOf(ResponseSuccess);
            expect(executeRes.value).toBeInstanceOf(CreatorEntity);
            expect(classToPlain(executeRes.value)).toEqual({ ...newCreatorInDB, hashedPassword: undefined });
        });

        it('should return existed error if username existed', async () => {
            // email found
            jest.spyOn(creatorRepository, 'findByUserName').mockResolvedValue(
                newCreatorInDB,
            );

            jest.spyOn(creatorRepository, 'createAndSave');

            const reqObj = CreateCreatorRequestObject.builder(requestCreator);

            const executeRes = await createCreatorUseCase.execute(reqObj);
            expect(creatorRepository.findByUserName).toBeCalledTimes(1);
            expect(creatorRepository.findByUserName).toBeCalledWith(
                requestCreatorData.username,
            );

            // expect doesn't call create and save
            expect(creatorRepository.createAndSave).toBeCalledTimes(0);

            // expect response failure with error message
            expect(executeRes).toBeInstanceOf(ResponseFailure);
            // failure message existed username
            expect((executeRes as ResponseFailure).value.message).toContain(
                'existed',
            );
        });
    });
});
