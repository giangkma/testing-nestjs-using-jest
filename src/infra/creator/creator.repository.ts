import * as _ from 'lodash';

import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    MongoRepository,
    ObjectLiteral,
    getMongoRepository,
} from 'typeorm';
import {
    CreateCreatorInfo,
    CreatorEntity,
    CreatorFilterInfo,
    ICreatorRepository,
    UpdateCreatorInfo,
} from '@src/domain/creator';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

import { Mapper } from '@nartc/automapper';
import { filterFollowers, UserRole } from '@src/domain/user';

@EntityRepository(UserModel)
export class CreatorRepository extends AbstractRepository<UserModel>
    implements ICreatorRepository {
    private readonly mRepository: MongoRepository<UserModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(UserModel);
    }

    /**
     * Create and save creator
     *
     * @param {CreateCreatorInfo} creatorInfo
     * @returns {(Promise<CreatorEntity | null>)}
     * @memberof CreatorRepository
     */
    async createAndSave(
        creatorInfo: CreateCreatorInfo,
    ): Promise<CreatorEntity> {
        // set creator data
        const creator = new UserModel();
        creator._id = creatorInfo.id;
        creator.organizationId = creatorInfo.organizationId;
        creator.role = creatorInfo.role;
        creator.createdDate = creatorInfo.createdDate;
        creator.sevenDigitalExpiresAt = creatorInfo.sevenDigitalExpiresAt;

        creator.profile = Mapper.map(creatorInfo.profile, UserProfileModel);

        if (creatorInfo.followers) {
            creator.followers = Mapper.map(
                creatorInfo.followers,
                UserFollowersModel,
            );
        }

        if (creatorInfo.email) {
            creator.email = creatorInfo.email;
        }

        if (creatorInfo.department) {
            creator.department = creatorInfo.department;
        }

        if (creatorInfo.followers) {
            filterFollowers(creator.followers);
        }

        // create creator in db
        const createdCreator = await this.manager.save(creator);

        // convert to entity class
        return Mapper.map(createdCreator, CreatorEntity);
    }

    /**
     * Update and save creator
     *
     * @param {string} id
     * @param {UpdatecreatorInfo} creatorInfo
     * @returns {(Promise<void>)}
     * @memberof CreatorRepository
     */
    async update(id: string, creatorInfo: UpdateCreatorInfo): Promise<void> {
        const updateCreatorData: Partial<UserModel> = _.omit(creatorInfo, [
            'profile',
            'email',
            'followers',
        ]);

        if (creatorInfo.avatar) {
            updateCreatorData['profile.avatar'] = creatorInfo.avatar;
        }

        if (creatorInfo.firstName) {
            updateCreatorData['profile.firstName'] = creatorInfo.firstName;
        }

        if (creatorInfo.lastName) {
            updateCreatorData['profile.lastName'] = creatorInfo.lastName;
        }

        if (creatorInfo.name) {
            updateCreatorData['profile.name'] = creatorInfo.name;
        }

        if (creatorInfo.phoneNumber) {
            updateCreatorData['profile.phoneNumber'] = creatorInfo.phoneNumber;
        }

        if (creatorInfo.jobTitle) {
            updateCreatorData['profile.jobTitle'] = creatorInfo.jobTitle;
        }

        if (creatorInfo.consumerIds) {
            updateCreatorData['followers.consumerIds'] =
                creatorInfo.consumerIds;
        }

        updateCreatorData.updatedDate = new Date();

        // update creator in db
        await this.manager.update<UserModel>(
            UserModel,
            { _id: id },
            updateCreatorData,
        );
    }

    /**
     * Find creator by id
     *
     * @param {string} id
     * @returns {Promise<CreatorEntity>}
     * @memberof CreatorRepository
     */
    async findById(id: string): Promise<CreatorEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
                role: UserRole.creator,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // creator is first element in array since id is unique
        return Mapper.map(res[0], CreatorEntity);
    }

    /**
     * Filter creators
     *
     * @param {CreatorFilterInfo} filter
     * @returns {(Promise<[CreatorEntity[], number] | null>)}
     * @memberof CreatorRepository
     */
    async list(filter: CreatorFilterInfo): Promise<[CreatorEntity[], number]> {
        const query: FindConditions<UserModel> | ObjectLiteral = {};

        // Ensure that we search for creators, not all kinds of users.
        query.role = {
            $eq: UserRole.creator,
        };

        // creator profile filter
        if (filter.firstName) {
            query['profile.firstName'] = filter.firstName;
        }

        if (filter.lastName) {
            query['profile.lastName'] = filter.lastName;
        }

        if (filter.name) {
            query['profile.name'] = filter.name;
        }

        if (filter.phoneNumber) {
            query['profile.phoneNumber'] = filter.phoneNumber;
        }

        if (filter.jobTitle) {
            query['profile.jobTitle'] = filter.jobTitle;
        }

        // creator followers filter
        if (filter.consumerIds) {
            // convert string to objectId
            query['followers.consumerIds'] = {
                $in: filter.consumerIds,
            };
        }

        if (filter.email) {
            query.email = filter.email;
        }

        if (filter.organizationId) {
            query.organizationId = filter.organizationId;
        }

        if (filter.department) {
            query.department = filter.department;
        }

        const [creators, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [creators.map(s => Mapper.map(s, CreatorEntity)), count];
    }

    /**
     *
     * Delete creator by id
     *
     * @param {string} id
     * @return
     * @memberof CreatorRepository
     */
    async delete(id: string): Promise<void> {
        await this.mRepository.delete({ _id: id });
    }

    /**
     *Assign many consumer ids to creator
     *
     * @param {string[]} creatorIds list creator ids
     * @param {string[]} consumerIds list consumer ids
     * @memberof CreatorRepository
     */
    async assignManyConsumers(
        creatorIds: string[],
        consumerIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: creatorIds,
                },
            },
            {
                $addToSet: {
                    'followers.consumerIds': {
                        $each: consumerIds,
                    },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }

    /**
     * Remove many consumer ids from list
     *
     * @param {string[]} creatorIds list creator ids
     * @param {string[]} consumerIds list consumer ids
     * @returns {Promise<void>}
     * @memberof CreatorRepository
     */
    async removeManyConsumers(
        creatorIds: string[],
        consumerIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: creatorIds,
                },
            },
            {
                $pull: {
                    'followers.consumerIds': {
                        $in: consumerIds,
                    },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }

    /**
     * Assign many nextOfKin ids to creator
     *
     * @param {string[]} creatorIds list creator ids
     * @param {string[]} nextOfKinIds list nextOfKin ids
     * @memberof CreatorRepository
     */
    async assignManyNextOfKins(
        creatorIds: string[],
        nextOfKinIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: creatorIds,
                },
            },
            {
                $addToSet: {
                    'followers.nextOfKinIds': {
                        $each: nextOfKinIds,
                    },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }

    /**
     * Remove many nextOfKin ids from list
     *
     * @param {string[]} creatorIds list creator ids
     * @param {string[]} nextOfKinIds list nextOfKin ids
     * @returns {Promise<void>}
     * @memberof CreatorRepository
     */
    async removeManyNextOfKins(
        creatorIds: string[],
        nextOfKinIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: creatorIds,
                },
            },
            {
                $pull: {
                    'followers.nextOfKinIds': {
                        $in: nextOfKinIds,
                    },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }
}
