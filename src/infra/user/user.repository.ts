import { IUserRepository } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';
import { AbstractRepository, EntityRepository } from 'typeorm';

@EntityRepository(UserModel)
export class UserRepository extends AbstractRepository<UserModel>
    implements IUserRepository {
    constructor() {
        super();
    }

    /**
     * Find user by id
     *
     * @param {string} id
     * @returns {Promise<CreatorInDB>}
     * @memberof UserRepository
     */
    async findById(id: string): Promise<UserModel | null> {
        // get user model instance by id
        const res = await this.repository.find({
            where: {
                _id: id,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // consumer is first element in array since id is unique
        return res[0];
    }

    /**
     * Find user by email
     *
     * @param {string} email
     * @returns {(Promise<UserModel | null>)}
     * @memberof UserRepository
     */
    async findByEmail(email: string): Promise<UserModel | null> {
        // find document with matched email
        const res = await this.repository.find({
            where: {
                email,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        return res[0];
    }

    /**
     * Update sevenDigitalExpiresAt and save user
     *
     * @param {string} id
     * @param {string} sevenDigitalExpiresAt
     * @returns {(Promise<UserModel | null>)}
     * @memberof UserRepository
     */
    async updateSevenDigitalExpiresAt(
        id: string,
        sevenDigitalExpiresAt: string,
    ): Promise<void> {
        // update organization in db
        await this.manager.update<UserModel>(
            UserModel,
            { _id: id },
            { sevenDigitalExpiresAt: new Date(sevenDigitalExpiresAt) },
        );
    }
}
