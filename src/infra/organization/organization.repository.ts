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
    CreateOrganizationInfo,
    getOrganizationId,
    IOrganizationRepository,
    OrganizationEntity,
    OrganizationFilterInfo,
    UpdateOrganizationInfo,
} from '@src/domain/organization';
import { UserModel, UserProfileModel } from '@src/infra/database/model';

import { Mapper } from '@nartc/automapper';
import { UserRole } from '@src/domain/user';

@EntityRepository(UserModel)
export class OrganizationRepository extends AbstractRepository<UserModel>
    implements IOrganizationRepository {
    private readonly mRepository: MongoRepository<UserModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(UserModel);
    }

    /**
     * Create and save organization
     *
     * @param {CreateOrganizationInfo} createOrganizationInfo
     * @returns {(Promise<OrganizationEntity | null>)}
     * @memberof OrganizationRepository
     */
    async createAndSave(
        createOrganizationInfo: CreateOrganizationInfo,
    ): Promise<OrganizationEntity> {
        // set organization data
        const organization = new UserModel();
        organization._id = createOrganizationInfo.id;
        organization.role = createOrganizationInfo.role;
        organization.licence = createOrganizationInfo.licence;
        organization.createdDate = createOrganizationInfo.createdDate;
        organization.organizationName = createOrganizationInfo.organizationName;
        organization.sevenDigitalExpiresAt =
            createOrganizationInfo.sevenDigitalExpiresAt;

        organization.profile = Mapper.map(
            createOrganizationInfo.profile,
            UserProfileModel,
        );

        if (createOrganizationInfo.email) {
            organization.email = createOrganizationInfo.email;
        }

        if (createOrganizationInfo.department) {
            organization.department = createOrganizationInfo.department;
        }

        // create organization in db
        const createdOrganization = await this.manager.save(organization);

        // convert to entity class
        return Mapper.map(createdOrganization, OrganizationEntity);
    }

    /**
     * Update and save organization
     *
     * @param {string} id
     * @param {UpdateOrganizationInfo} updateOrganizationInfo
     * @returns {(Promise<void>)}
     * @memberof OrganizationRepository
     */
    async update(
        id: string,
        updateOrganizationInfo: UpdateOrganizationInfo,
    ): Promise<void> {
        const updateOrganizationData: Partial<UserModel> = _.omit(
            updateOrganizationInfo,
            ['profile', 'email', 'followers'],
        );

        if (updateOrganizationInfo.avatar) {
            updateOrganizationData['profile.avatar'] =
                updateOrganizationInfo.avatar;
        }

        if (updateOrganizationInfo.firstName) {
            updateOrganizationData['profile.firstName'] =
                updateOrganizationInfo.firstName;
        }

        if (updateOrganizationInfo.lastName) {
            updateOrganizationData['profile.lastName'] =
                updateOrganizationInfo.lastName;
        }

        if (updateOrganizationInfo.name) {
            updateOrganizationData['profile.name'] =
                updateOrganizationInfo.name;
        }

        if (updateOrganizationInfo.phoneNumber) {
            updateOrganizationData['profile.phoneNumber'] =
                updateOrganizationInfo.phoneNumber;
        }

        if (updateOrganizationInfo.jobTitle) {
            updateOrganizationData['profile.jobTitle'] =
                updateOrganizationInfo.jobTitle;
        }

        updateOrganizationData.updatedDate = new Date();

        // update organization in db
        await this.manager.update<UserModel>(
            UserModel,
            { _id: id },
            updateOrganizationData,
        );
    }

    /**
     * Find organization by id
     *
     * @param {string} id
     * @returns {Promise<OrganizationEntity>}
     * @memberof OrganizationRepository
     */
    async findById(id: string): Promise<OrganizationEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
                role: UserRole.organization,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // organization is first element in array since id is unique
        return Mapper.map(res[0], OrganizationEntity);
    }

    /**
     * Find organization by organizationName
     *
     * @param {string} organizationName
     * @returns {Promise<OrganizationEntity>}
     * @memberof OrganizationRepository
     */
    async findByOrganizationName(
        organizationName: string,
    ): Promise<OrganizationEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                organizationName,
                role: UserRole.organization,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // organization is first element in array since id is unique
        return Mapper.map(res[0], OrganizationEntity);
    }

    /**
     * Filter organizations
     *
     * @param {OrganizationFilterInfo} filter
     * @returns {(Promise<[OrganizationEntity[], number] | null>)}
     * @memberof OrganizationRepository
     */
    async list(
        filter: OrganizationFilterInfo,
    ): Promise<[OrganizationEntity[], number]> {
        const query: FindConditions<UserModel> | ObjectLiteral = {};

        // Ensure that we search for organization, not all kinds of users.
        query.role = {
            $eq: UserRole.organization,
        };

        // organization profile filter
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

        if (filter.email) {
            query.email = filter.email;
        }

        if (filter.department) {
            query.department = filter.department;
        }

        const [organization, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [
            organization.map(s => Mapper.map(s, OrganizationEntity)),
            count,
        ];
    }

    /**
     *
     * Delete organization by id
     *
     * @param {string} id
     * @return {Promise<void>}
     * @memberof OrganizationRepository
     */
    async delete(id: string): Promise<void> {
        await this.mRepository.delete({ _id: id });
    }

    async getOrganizationName(user: UserModel): Promise<string> {
        if (user.role === UserRole.organization) {
            return user.organizationName;
        } else {
            const organizationId = getOrganizationId(user);
            const organization = await this.findById(organizationId);
            return organization.organizationName;
        }
    }

    /**
     * Remove consumer id from list followers
     *
     * @param {string} organizationId
     * @param {string} consumerId
     * @returns {Promise<void>}
     * @memberof OrganizationRepository
     */
    async removeConsumer(
        organizationId: string,
        consumerId: string,
    ): Promise<void> {
        await this.mRepository.updateOne(
            {
                _id: organizationId,
            },
            {
                $pull: {
                    'followers.consumerIds': consumerId,
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }
}
