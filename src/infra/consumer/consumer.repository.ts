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
    ConsumerEntity,
    ConsumerFilterInfo,
    CreateConsumerInfo,
    IConsumerRepository,
    UpdateConsumerInfo,
} from '@src/domain/consumer';
import {
    SurveyFormModel,
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

import { Mapper } from '@nartc/automapper';
import { filterFollowers, UserRole } from '@src/domain/user';

@EntityRepository(UserModel)
export class ConsumerRepository extends AbstractRepository<UserModel>
    implements IConsumerRepository {
    private readonly mRepository: MongoRepository<UserModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(UserModel);
    }
    /**
     * Create and save consumer
     *
     * @param {CreateConsumerInfo} consumerInfo
     * @returns {(Promise<ConsumerEntity | null>)}
     * @memberof ConsumerRepository
     */
    async createAndSave(
        consumerInfo: CreateConsumerInfo,
    ): Promise<ConsumerEntity> {
        // set consumer data
        const newConsumer = new UserModel();
        newConsumer._id = consumerInfo.id;
        newConsumer.username = consumerInfo.username;
        newConsumer.role = consumerInfo.role;
        newConsumer.organizationId = consumerInfo.organizationId;
        newConsumer.sevenDigitalExpiresAt = consumerInfo.sevenDigitalExpiresAt;

        if (consumerInfo.followers) {
            newConsumer.followers = Mapper.map(
                consumerInfo.followers,
                UserFollowersModel,
            );
        }

        newConsumer.profile = Mapper.map(
            consumerInfo.profile,
            UserProfileModel,
        );

        if (consumerInfo.surveyForm) {
            newConsumer.surveyForm = Mapper.map(
                consumerInfo.surveyForm,
                SurveyFormModel,
            );
        }

        newConsumer.createdDate = consumerInfo.createdDate;

        if (newConsumer.followers) {
            filterFollowers(newConsumer.followers);
        }

        // create consumer in db
        const createdConsumer = await this.manager.save(newConsumer);

        // convert to entity class
        return Mapper.map(createdConsumer, ConsumerEntity);
    }

    /**
     * Update and save consumer
     *
     * @param {string} id
     * @param {UpdateConsumerInfo} consumerInfo
     * If saving a nested surveyForm data, it overrides all fields value on db.
     * Use currentConsumer to get a current surveyForm and merge with previous value to prevent overriding other fields.
     * @param {ConsumerInDB} currentConsumer
     * @returns {(Promise<void>)}
     * @memberof ConsumerRepository
     */
    async update(
        id: string,
        consumerInfo: UpdateConsumerInfo,
        currentConsumer: ConsumerEntity,
    ): Promise<void> {
        // set consumer data
        const updateConsumerData: Partial<UserModel> = _.omit(consumerInfo, [
            'organizationId',
            'surveyForm',
            'followers',
            'profile',
        ]);

        if (consumerInfo.avatar) {
            updateConsumerData['profile.avatar'] = consumerInfo.avatar;
        }

        if (consumerInfo.firstName) {
            updateConsumerData['profile.firstName'] = consumerInfo.firstName;
        }

        if (consumerInfo.lastName) {
            updateConsumerData['profile.lastName'] = consumerInfo.lastName;
        }

        if (consumerInfo.surveyForm) {
            // If survey form exists and combine, map survey form instance
            const surveyForm = currentConsumer.surveyForm
                ? _.merge(currentConsumer.surveyForm, consumerInfo.surveyForm)
                : consumerInfo.surveyForm;

            updateConsumerData.surveyForm = Mapper.map(
                surveyForm,
                SurveyFormModel,
            );
        }

        updateConsumerData.updatedDate = new Date();

        // update consumer in db
        await this.manager.update<UserModel>(
            UserModel,
            { _id: id },
            updateConsumerData,
        );
    }

    /**
     * Find consumer by username
     *
     * @param {string} username
     * @returns {(Promise<ConsumerInDB | null>)}
     * @memberof ConsumerRepository
     */
    async findByUserName(username: string): Promise<ConsumerEntity | null> {
        // find document with matched email
        const res = await this.repository.find({
            where: {
                username,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // creator is first element in array since email is unique
        return Mapper.map(res[0], ConsumerEntity);
    }

    /**
     * Find consumer by id
     *
     * @param {string} id
     * @returns {Promise<CreatorInDB>}
     * @memberof ConsumerRepository
     */
    async findById(id: string): Promise<ConsumerEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
                role: UserRole.consumer,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // consumer is first element in array since id is unique
        return Mapper.map(res[0], ConsumerEntity);
    }

    async countConsumersInOrganization(
        organizationId: string,
    ): Promise<number> {
        const nConsumers = await this.mRepository.count({
            role: { $eq: UserRole.consumer },
            organizationId,
        });

        return nConsumers;
    }

    async list(
        filter: ConsumerFilterInfo,
    ): Promise<[ConsumerEntity[], number]> {
        const query: FindConditions<UserModel> | ObjectLiteral = {};

        // Ensure that we search for consumer, not all kinds of users
        query.role = {
            $eq: UserRole.consumer,
        };

        if (filter.firstName) {
            query['profile.firstName'] = filter.firstName;
        }

        if (filter.lastName) {
            query['profile.lastName'] = filter.lastName;
        }

        if (filter.organizationId) {
            query.organizationId = filter.organizationId;
        }

        if (filter.creatorIds && filter.creatorIds.length > 0) {
            query['followers.creatorIds'] = {
                $in: filter.creatorIds,
            };
        }

        if (filter.username) {
            query.username = filter.username;
        }

        const [consumers, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [consumers.map(s => Mapper.map(s, ConsumerEntity)), count];
    }

    async delete(id: string): Promise<void> {
        await this.mRepository.delete({ _id: id });
    }

    /**
     * Assign many creator ids to consumer
     *
     * @param {string[]} consumerIds list consumer ids
     * @param {string[]} creatorIds list creator ids
     * @memberof ConsumerRepository
     */
    async assignManyCreators(
        consumerIds: string[],
        creatorIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: consumerIds,
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
     * @param {string} consumerIds list consumer ids
     * @param {string[]} creatorIds list creator ids
     * @returns {Promise<void>}
     * @memberof ConsumerRepository
     */
    async removeManyCreators(
        consumerIds: string[],
        creatorIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: consumerIds,
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
     * Assign many next-of-kin ids to consumer
     *
     * @param {string[]} consumerIds list consumer ids
     * @param {string[]} nextOfKinIds list next-of-kin ids
     * @memberof ConsumerRepository
     */
    async assignManyNextOfKins(
        consumerIds: string[],
        nextOfKinIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: consumerIds,
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
     * Remove many next-of-kin ids from list
     *
     * @param {string[]} consumerIds list consumer ids
     * @param {string[]} nextOfKinIds list next-of-kin ids
     * @memberof ConsumerRepository
     */
    async removeManyNextOfKins(
        consumerIds: string[],
        nextOfKinIds: string[],
    ): Promise<void> {
        await this.mRepository.updateMany(
            {
                _id: {
                    $in: consumerIds,
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
