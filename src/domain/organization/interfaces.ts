import {
    OrganizationEntity,
    OrganizationProfile,
    UpdateOrganizationProfile,
} from './organization.entity';
import { UserFilterInfo, UserRole } from '@src/domain/user';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';
import { UserModel } from '@src/infra/database/model';

export interface CreateOrganizationInfo {
    id?: string;
    email?: string;
    createdDate?: Date;
    role?: UserRole;
    profile: OrganizationProfile;
    department?: string;
    licence: number;
    organizationName: string;
    sevenDigitalExpiresAt?: Date;
}

export interface UpdateOrganizationInfo {
    firstName?: string;
    lastName?: string;
    name?: string;
    avatar?: string;
    phoneNumber?: string;
    jobTitle?: string;
    profile?: UpdateOrganizationProfile;
    role?: UserRole;
    department?: string;
    licence?: number;
}

export interface OrganizationFilterInfo
    extends BaseListFilterInfo,
        UserFilterInfo,
        UpdateOrganizationProfile {
    firstName?: string;
    lastName?: string;
    name?: string;
    phoneNumber?: string;
    jobTitle?: string;
    email?: string;
    department?: string;
}

export interface LicenceEntity {
    total: number;
    active: number;
}

/**
 * Organization repository interface for dependency inversion
 *
 * @export
 * @interface IOrganizationRepository
 */
export interface IOrganizationRepository {
    createAndSave: (
        createOrganizationInfo: CreateOrganizationInfo,
    ) => Promise<OrganizationEntity>;
    delete: (id: string) => Promise<void>;
    findById: (id: string) => Promise<OrganizationEntity | null>;
    list: (
        filter: OrganizationFilterInfo,
    ) => Promise<[OrganizationEntity[], number]>;
    update: (
        id: string,
        updateOrganizationInfo: UpdateOrganizationInfo,
    ) => Promise<void>;
    getOrganizationName: (user: UserModel) => Promise<string>;
}
