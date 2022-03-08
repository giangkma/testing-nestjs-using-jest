import {
    NextOfKinEntity,
    NextOfKinFollowers,
    NextOfKinProfile,
} from './nextOfKin.entity';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';
import { UserRole } from '@src/domain/user';

export interface CreateNextOfKinInfo {
    id?: string;
    email: string;
    createdDate?: Date;
    role?: UserRole;
    organizationId: string;
    profile?: NextOfKinProfile;
    followers?: NextOfKinFollowers;
    consent?: boolean;
}

export interface UpdateNextOfKinInfo {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    consumerIds?: string[];
    creatorIds?: string[];
    organizationId?: string;
    phoneNumber?: string;
    consent?: boolean;
}

export interface NextOfKinFilterInfo extends BaseListFilterInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    organizationId?: string;
    consumerIds?: string[];
}

/**
 * NextOfKin repository interface for dependency inversion
 *
 * @export
 * @interface INextOfKinRepository
 */
export interface INextOfKinRepository {
    createAndSave: (
        nextOfKinInfo: CreateNextOfKinInfo,
    ) => Promise<NextOfKinEntity>;
    update: (id: string, consumerInfo: UpdateNextOfKinInfo) => Promise<void>;
    findById: (id: string) => Promise<NextOfKinEntity | null>;
    list(filter: NextOfKinFilterInfo): Promise<[NextOfKinEntity[], number]>;
    delete: (id: string) => Promise<void>;
}
