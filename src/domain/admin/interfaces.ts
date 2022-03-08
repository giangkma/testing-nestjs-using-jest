import { UserRole } from '@src/domain/user';
import { AdminEntity, AdminFollowers, AdminProfile } from './Admin.entity';

export interface CreateAdminInfo {
    id?: string;
    email?: string;
    createdDate?: Date;
    role?: UserRole;
    profile: AdminProfile;
    sevenDigitalExpiresAt?: Date;
    followers?: AdminFollowers;
}

/**
 * Admin repository interface for dependency inversion
 *
 * @export
 * @interface IAdminRepository
 */
export interface IAdminRepository {
    createAndSave: (createAdminInfo: CreateAdminInfo) => Promise<AdminEntity>;
    delete: (id: string) => Promise<void>;
}
