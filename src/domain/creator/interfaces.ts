import {
    CreatorEntity,
    CreatorFollowers,
    CreatorProfile,
} from './creator.entity';
import { UserFilterInfo, UserRole } from '@src/domain/user';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';
import { UpdateCreatorProfile } from './creator.entity';

export interface CreateCreatorInfo {
    id?: string;
    email?: string;
    createdDate?: Date;
    role?: UserRole;
    profile: CreatorProfile;
    followers?: CreatorFollowers;
    department?: string;
    organizationId: string;
    sevenDigitalExpiresAt?: Date;
}

export interface UpdateCreatorInfo {
    firstName?: string;
    lastName?: string;
    name?: string;
    avatar?: string;
    phoneNumber?: string;
    organizationId?: string;
    jobTitle?: string;
    profile?: UpdateCreatorProfile;
    department?: string;
    consumerIds?: string[];
}

export interface CreatorFilterInfo
    extends BaseListFilterInfo,
        UserFilterInfo,
        UpdateCreatorProfile {
    organizationId?: string;
    email?: string;
    department?: string;
    consumerIds?: string[];
}

/**
 * Creator repository interface for dependency inversion
 *
 * @export
 * @interface ICreatorRepository
 */
export interface ICreatorRepository {
    createAndSave: (creatorInfo: CreateCreatorInfo) => Promise<CreatorEntity>;
    delete: (id: string) => Promise<void>;
    findById: (id: string) => Promise<CreatorEntity | null>;
    list: (filter: CreatorFilterInfo) => Promise<[CreatorEntity[], number]>;
    update: (id: string, creatorInfo: UpdateCreatorInfo) => Promise<void>;
    assignManyConsumers: (
        creatorIds: string[],
        consumerIds: string[],
    ) => Promise<void>;
    removeManyConsumers: (
        creatorIds: string[],
        consumerIds: string[],
    ) => Promise<void>;
}
