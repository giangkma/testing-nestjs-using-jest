import * as _ from 'lodash';

import {
    ListCreatorsPayload,
    creatorInDBFactory,
    listCreatorsFactory,
} from '@src/domain/creator';
import {
    ListCreatorsRequestObject,
    ListCreatorsUseCase,
} from './listCreators.usecase';
import { UserRoles, UserStatus } from '@src/domain/user';

import { AuthService } from '@src/infra/auth/auth.service';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { MockAuthService } from '@root/test/mock/infra/auth/auth.service';
import { MockCreatorRepository } from '@root/test/mock/infra/creator/creator.repository';
import { ResponseSuccess } from '@src/app/shared/responseObject';
import { Test } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('list creator usecase', () => {
    let listCreatorsUseCase: ListCreatorsUseCase;
    let creatorRepository: CreatorRepository;

    beforeAll(async () => {
        const modulRef = await Test.createTestingModule({
            providers: [
                ListCreatorsUseCase,
                // create mock repositories provider
                {
                    provide: getRepositoryToken(CreatorRepository),
                    useClass: MockCreatorRepository,
                },
                {
                    provide: AuthService,
                    useClass: MockAuthService,
                },
            ],
        }).compile();

        listCreatorsUseCase = modulRef.get<ListCreatorsUseCase>(
            ListCreatorsUseCase,
        );
        creatorRepository = modulRef.get<CreatorRepository>(CreatorRepository);
    });

    afterEach(() => {
        // clear mocks after each test
        jest.clearAllMocks();
    });

    describe('execute success', () => {
        // new Creator instance
        const creatorData1 = {
            id: '5f61b55913507b0026d277c8',
            username: 'test_creator_username',
            email: 'test_creator@test.com',
            profile: {
                firstName: 'creator_first_name',
                lastName: 'creator_last_name',
                phoneNumber: '4762980016',
            },
            followers: {
                consumerIds: ['5ffc5dcfbaa8354c5498cfd0'],
            },
            organizationId: '5ee34ece4f21081bb9661811',
            hashedPassword: 'hashed_password',
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: new Date(),
        };
        const creatorData2 = {
            id: '5f61b55913507b0026d277c8',
            username: 'test_creator_username_2',
            email: 'test_creator_2@test.com',
            profile: {
                firstName: 'creator_first_name_2',
                lastName: 'creator_last_name_2',
                phoneNumber: '4762980016',
            },
            followers: {
                consumerIds: ['5ffc5d8c5b5e4be3860a9fea'],
            },
            organizationId: '5ee34ece4f21081bb9661811',
            hashedPassword: 'hashed_password',
            status: UserStatus.active,
            roles: [UserRoles.creator],
            createdDate: new Date(),
        };

        const creatorsData = [creatorData1, creatorData2];

        const creatorInDB1 = creatorInDBFactory(creatorData1);
        const creatorInDB2 = creatorInDBFactory(creatorData2);
        const creatorsDataInDB = [creatorInDB1, creatorInDB2];
        const filter: ListCreatorsPayload = listCreatorsFactory({
            profile: {
                phoneNumber: '4762980016',
            },
        });

        it('should return creator success respond', async () => {
            jest.spyOn(creatorRepository, 'list').mockResolvedValue([
                creatorsDataInDB,
                2,
            ]);
            const reqObj = ListCreatorsRequestObject.builder(filter);
            const executeRes = await listCreatorsUseCase.execute(reqObj);
            expect(creatorRepository.list).toBeCalledTimes(1);

            // expect return success response with list Creators
            expect(executeRes).toBeInstanceOf(ResponseSuccess);
            expect(executeRes.value).toBeInstanceOf(Object);
            expect(classToPlain(executeRes.value)).toEqual({
                data: creatorsData.map(creator =>
                    _.omit(creator, ['hashedPassword']),
                ),
                info: {
                    total: 2,
                },
            });
        });
    });
});
