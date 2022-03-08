import { Mapper } from '@nartc/automapper';
import {
    CreateNextOfKinInfo,
    INextOfKinRepository,
    NextOfKinEntity,
    NextOfKinFilterInfo,
    UpdateNextOfKinInfo,
} from '@src/domain/nextOfKin';
import { filterFollowers, UserRole } from '@src/domain/user';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';
import * as _ from 'lodash';
import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    getMongoRepository,
    MongoRepository,
    ObjectLiteral,
} from 'typeorm';

@EntityRepository(UserModel)
export class NextOfKinRepository extends AbstractRepository<UserModel>
    implements INextOfKinRepository {
    private readonly mRepository: MongoRepository<UserModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(UserModel);
    }
    /**
     * Create and save next-of-kin
     *
     * @param {CreateNextOfKinInfo} nextOfKinInfo
     * @returns {(Promise<NextOfKinEntity | null>)}
     * @memberof NextOfKinRepository
     */
    async createAndSave(
        nextOfKinInfo: CreateNextOfKinInfo,
    ): Promise<NextOfKinEntity> {
        // set next-of-kin data
        const nextOfKin = new UserModel();

        nextOfKin.email = nextOfKinInfo.email;
        nextOfKin.role = nextOfKinInfo.role;
        nextOfKin.organizationId = nextOfKinInfo.organizationId;

        nextOfKin.consent = false;
        if (nextOfKinInfo.consent) {
            nextOfKin.consent = nextOfKinInfo.consent;
        }

        if (nextOfKinInfo.id) {
            nextOfKin._id = nextOfKinInfo.id;
        }

        if (nextOfKinInfo.followers) {
            nextOfKin.followers = Mapper.map(
                nextOfKinInfo.followers,
                UserFollowersModel,
            );
        }

        if (nextOfKin.followers) {
            filterFollowers(nextOfKin.followers);
        }

        nextOfKin.profile = Mapper.map(nextOfKinInfo.profile, UserProfileModel);

        nextOfKin.createdDate = nextOfKinInfo.createdDate;

        // create netx-of-kin in db
        const createdNextOfKin = await this.manager.save(nextOfKin);

        // convert to entity class
        return Mapper.map(createdNextOfKin, NextOfKinEntity);
    }

    /**
     * Update and save next-of-kin
     *
     * @param {string} id
     * @param {UpdateNextOfKinInfo} nextOfKinInfo
     * @returns {(Promise<void>)}
     * @memberof NextOfKinRepository
     */
    async update(
        id: string,
        nextOfKinInfo: UpdateNextOfKinInfo,
    ): Promise<void> {
        // set next-of-kin data
        const updateNextOfKinData: Partial<UserModel> = _.omit(nextOfKinInfo, [
            'followers',
            'profile',
            'email',
        ]);

        if (nextOfKinInfo.avatar) {
            updateNextOfKinData['profile.avatar'] = nextOfKinInfo.avatar;
        }

        if (nextOfKinInfo.firstName) {
            updateNextOfKinData['profile.firstName'] = nextOfKinInfo.firstName;
        }

        if (nextOfKinInfo.lastName) {
            updateNextOfKinData['profile.lastName'] = nextOfKinInfo.lastName;
        }

        if (nextOfKinInfo.phoneNumber) {
            updateNextOfKinData['profile.phoneNumber'] =
                nextOfKinInfo.phoneNumber;
        }

        if (nextOfKinInfo.consumerIds) {
            updateNextOfKinData['followers.consumerIds'] =
                nextOfKinInfo.consumerIds;
        }

        if (nextOfKinInfo.creatorIds) {
            updateNextOfKinData['followers.creatorIds'] =
                nextOfKinInfo.creatorIds;
        }

        if (nextOfKinInfo.consent) {
            updateNextOfKinData.consent = nextOfKinInfo.consent;
        }

        updateNextOfKinData.updatedDate = new Date();

        // update next-of-kin in db
        await this.manager.update<UserModel>(
            UserModel,
            { _id: id },
            updateNextOfKinData,
        );
    }

    /**
     * Find next-of-kin by id
     *
     * @param {string} id
     * @returns {Promise<CreatorInDB>}
     * @memberof NextOfKinRepository
     */
    async findById(id: string): Promise<NextOfKinEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
                role: UserRole.nextOfKin,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // next-of-kin is first element in array since id is unique
        return Mapper.map(res[0], NextOfKinEntity);
    }

    /**
     *
     * Get list next-of-kins (by filter)
     *
     * @param {NextOfKinFilterInfo} filter
     * @returns {Promise<[NextOfKinInDB[], number]>}
     */
    async list(
        filter: NextOfKinFilterInfo,
    ): Promise<[NextOfKinEntity[], number]> {
        const query: FindConditions<UserModel> | ObjectLiteral = {};

        // Ensure that we search for next-of-kin, not all kinds of users
        query.role = {
            $eq: UserRole.nextOfKin,
        };

        if (filter.firstName) {
            query['profile.firstName'] = filter.firstName;
        }

        if (filter.lastName) {
            query['profile.lastName'] = filter.lastName;
        }

        if (filter.email) {
            query.email = filter.email;
        }

        if (filter.organizationId) {
            query.organizationId = filter.organizationId;
        }

        if (filter.consumerIds && filter.consumerIds.length > 0) {
            query['followers.consumerIds'] = {
                $in: filter.consumerIds,
            };
        }

        const [nextOfKins, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [nextOfKins.map(s => Mapper.map(s, NextOfKinEntity)), count];
    }

    /**
     *
     * Delete next-of-kin
     *
     * @param {string} id
     * @returns {Promise<void>}
     * @memberof NextOfKinRepository
     */
    async delete(id: string): Promise<void> {
        await this.mRepository.delete({ _id: id });
    }

    /**
     * Assign many creator ids to nextOfkin
     *
     * @param {string[]} nextOfKinIds list nextOfkin ids
     * @param {string[]} creatorIds list creator ids
     * @memberof NextOfKinRepository
     */
    async assignManyCreators(
        nextOfKinIds: string[],
        creatorIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: nextOfKinIds,
                },
            },
            {
                $addToSet: {
                    'followers.creatorIds': {
                        $each: creatorIds,
                    },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }

    /**
     * Remove many creator ids from list
     *
     * @param {string[]} nextOfKinIds list nextOfKin ids
     * @param {string[]} creatorIds list creator ids
     * @returns {Promise<void>}
     * @memberof NextOfKinRepository
     */
    async removeManyCreators(
        nextOfKinIds: string[],
        creatorIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: nextOfKinIds,
                },
            },
            {
                $pull: {
                    'followers.creatorIds': {
                        $in: creatorIds,
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
     * @param {string[]} nextOfKinIds list nextOfKin ids
     * @param {string[]} consumerIds list consumer ids
     * @returns {Promise<void>}
     * @memberof NextOfKinRepository
     */
    async removeManyConsumers(
        nextOfKinIds: string[],
        consumerIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: nextOfKinIds,
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
}
