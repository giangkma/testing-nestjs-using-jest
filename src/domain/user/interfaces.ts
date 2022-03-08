import { UserModel } from '@src/infra/database/model';

/**
 * User repository interface for dependency inversion
 *
 * @export
 * @interface IUserRepository
 */
export interface IUserRepository {
    findById: (id: string) => Promise<UserModel | null>;
    findByEmail: (email: string) => Promise<UserModel | null>;
}
