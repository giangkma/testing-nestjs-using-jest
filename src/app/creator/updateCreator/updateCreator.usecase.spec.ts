import * as _ from 'lodash';

import { CreatorEntity, creatorInDBFactory, updateCreatorFactory } from '@src/domain/creator';
import {
    ResponseFailure,
    ResponseSuccess,
} from '@src/app/shared/responseObject';
import { UpdateCreatorRequestObject, UpdateCreatorUseCase } from './updateCreator.usecase'
import { UserRoles, UserStatus } from '@src/domain/user';

import { AuthService } from '@src/infra/auth/auth.service';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { MockAuthService, } from '@root/test/mock/infra/auth/auth.service';
import { MockCreatorRepository } from '@root/test/mock/infra/creator/creator.repository';
import { Test } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Update creator usecase', () => {
    let updateCreatorUseCase: UpdateCreatorUseCase;
    let creatorRepository: CreatorRepository;

    beforeAll(async () => {
        const modulRef = await Test.createTestingModule({
            providers: [
                UpdateCreatorUseCase,
                // create mock repositories provider
                {
                    provide: getRepositoryToken(CreatorRepository),
                    useClass: MockCreatorRepository
                },
                {
                    provide: AuthService,
                    useClass: MockAuthService
                }
            ]
        }).compile();

        updateCreatorUseCase = modulRef.get<UpdateCreatorUseCase>(UpdateCreatorUseCase);
        creatorRepository = modulRef.get<CreatorRepository>(CreatorRepository);
    });

    afterEach(() => {
        // clear mocks after each test
        jest.clearAllMocks();
    });

    const existedCreatorId = '5f61b55913507b0026d277c8';
    const fakeCreatorId = '5fcf4650ca0d90614853fe18';

    // a creator existed instance
    const existedCreatorData = {
        id: existedCreatorId,
        username: 'test_creator_username',
        email: 'test_creator@test.com',
        profile: {
            firstName: 'creator_first_name',
            lastName: 'creator_last_name',
            phoneNumber: '4762980016',
        },
        organizationId: '5ee34ece4f21081bb9661811',
        hashedPassword: 'hashed_password',
        status: UserStatus.active,
        roles: [UserRoles.creator],
        createdDate: new Date(),
    };

    const existedCreatorInDB = creatorInDBFactory(existedCreatorData);

    describe('execute success', () => {
        // creator update info
        const creatorUpdateInfo = updateCreatorFactory({
            username: 'test_creator_username_2',
            profile: {
                firstName: 'creator_first_name_2',
            }
        });

        // updated creator instance
        const updatedCreatorData = {
            ...existedCreatorData,
            ...creatorUpdateInfo,
            profile: {
                ...existedCreatorData.profile,
                ...creatorUpdateInfo.profile
            },
            updatedDate: new Date()
        }

        const updatedCreatorInDB = creatorInDBFactory(updatedCreatorData)

        it('should return updated creator success response', async () => {
            // creator id exists
            jest.spyOn(creatorRepository, 'findById').mockResolvedValue(
                existedCreatorInDB,
            );

            // update creator
            jest.spyOn(creatorRepository, 'update').mockResolvedValue(null);

            // get creator updated
            jest.spyOn(creatorRepository, 'findById').mockResolvedValue(
                updatedCreatorInDB
            );

            const reqObj = UpdateCreatorRequestObject.builder(
                existedCreatorId,
                creatorUpdateInfo,
            );

            const executeRes = await updateCreatorUseCase.execute(reqObj);

            expect(creatorRepository.findById).toBeCalledTimes(2);
            expect(creatorRepository.findById).toBeCalledWith(
                existedCreatorId,
            );
            expect(creatorRepository.update).toBeCalledTimes(1);
            // expect return success response with creator updated
            expect(executeRes).toBeInstanceOf(ResponseSuccess);
            expect(executeRes.value).toBeInstanceOf(CreatorEntity);
            expect(classToPlain(executeRes.value)).toEqual(_.omit(updatedCreatorData, ['hashedPassword']));
        });

        it('should return not existed error if creator id does not exist ', async () => {
            // creator id not found
            jest.spyOn(creatorRepository, 'findById').mockResolvedValue(
                null,
            );
            jest.spyOn(creatorRepository, 'update');

            const reqObj = UpdateCreatorRequestObject.builder(
                fakeCreatorId,
                creatorUpdateInfo,
            );

            const executeRes = await updateCreatorUseCase.execute(reqObj);
            expect(creatorRepository.findById).toBeCalledTimes(1);
            expect(creatorRepository.findById).toBeCalledWith(
                fakeCreatorId
            );

            // expect doesn't call update
            expect(creatorRepository.update).toBeCalledTimes(0);

            // expect response failure with error message
            expect(executeRes).toBeInstanceOf(ResponseFailure);
            // failure message existed username
            expect((executeRes as ResponseFailure).value.message).toContain(
                'Creator does not exist',
            );
        });
    })
})
