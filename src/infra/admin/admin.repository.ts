import { Mapper } from '@nartc/automapper';
import {
    AdminEntity,
    CreateAdminInfo,
    IAdminRepository,
} from '@src/domain/admin';
import { filterFollowers, UserRole } from '@src/domain/user';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';
import {
    AbstractRepository,
    EntityRepository,
    getMongoRepository,
    MongoRepository,
} from 'typeorm';

@EntityRepository(UserModel)
export class AdminRepository extends AbstractRepository<UserModel>
    implements IAdminRepository {
    private readonly mRepository: MongoRepository<UserModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(UserModel);
    }

    /**
     * Create and save admin
     *
     * @param {CreateAdminInfo} adminInfo
     * @returns {(Promise<AdminEntity | null>)}
     * @memberof AdminRepository
     */
    async createAndSave(adminInfo: CreateAdminInfo): Promise<AdminEntity> {
        // set admin data
        const admin = new UserModel();
        admin._id = adminInfo.id;
        admin.role = adminInfo.role;
        admin.createdDate = adminInfo.createdDate;
        admin.sevenDigitalExpiresAt = adminInfo.sevenDigitalExpiresAt;

        admin.profile = Mapper.map(adminInfo.profile, UserProfileModel);

        if (adminInfo.followers) {
            admin.followers = Mapper.map(
                adminInfo.followers,
                UserFollowersModel,
            );
        }

        if (adminInfo.email) {
            admin.email = adminInfo.email;
        }

        if (adminInfo.followers) {
            filterFollowers(admin.followers);
        }

        // create admin in db
        const createdAdmin = await this.manager.save(admin);

        // convert to entity class
        return Mapper.map(createdAdmin, AdminEntity);
    }

    /**
     * Find admin by id
     *
     * @param {string} id
     * @returns {Promise<AdminEntity>}
     * @memberof AdminRepository
     */
    async findById(id: string): Promise<AdminEntity | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
                role: UserRole.admin,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // admin is first element in array since id is unique
        return Mapper.map(res[0], AdminEntity);
    }

    /**
     *
     * Delete admin by id
     *
     * @param {string} id
     * @return
     * @memberof AdminRepository
     */
    async delete(id: string): Promise<void> {
        await this.mRepository.delete({ _id: id });
    }

    /**
     * Assign organization ids to admin
     *
     * @param {string[]} adminId
     * @param {string[]} organizationId
     * @memberof AdminRepository
     */
    async assignOrganization(
        adminId: string,
        organizationId: string,
    ): Promise<void> {
        await this.mRepository.updateOne(
            {
                _id: adminId,
            },
            {
                $addToSet: {
                    'followers.organizationIds': organizationId,
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }

    /**
     * Remove organization from list followers
     *
     * @param {string} adminId
     * @param {string} organizationId
     * @returns {Promise<void>}
     * @memberof AdminRepository
     */
    async removeOrganization(
        adminId: string,
        organizationId: string,
    ): Promise<void> {
        await this.mRepository.updateOne(
            {
                _id: adminId,
            },
            {
                $pull: {
                    'followers.organizationIds': organizationId,
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );
    }
}
