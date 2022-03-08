import {
    ConsumerEntity,
    ConsumerFollowers,
    ConsumerProfile,
    SurveyForm,
} from './consumer.entity';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';
import { UserRole } from '../user';

export interface CreateConsumerInfo {
    id?: string;
    username: string;
    role?: UserRole;
    profile: ConsumerProfile;
    organizationId?: string;
    followers?: ConsumerFollowers;
    surveyForm?: SurveyForm;
    createdDate?: Date;
    sevenDigitalExpiresAt?: Date;
}

export interface UpdateConsumerInfo {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    surveyForm?: SurveyForm;
}

export interface ConsumerFilterInfo extends BaseListFilterInfo {
    firstName?: string;
    lastName?: string;
    creatorIds?: string[];
    organizationId?: string;
    username?: string;
}

export interface ConsumerDetailedFilterInfo {
    name?: boolean;
}

/**
 * Consumer repository interface for dependency inversion
 *
 * @export
 * @interface IConsumerRepository
 */
export interface IConsumerRepository {
    createAndSave: (
        consumerInfo: CreateConsumerInfo,
    ) => Promise<ConsumerEntity>;
    update: (
        id: string,
        consumerInfo: UpdateConsumerInfo,
        currentConsumer: ConsumerEntity,
    ) => Promise<void>;
    findByUserName: (username: string) => Promise<ConsumerEntity | null>;
    findById: (id: string) => Promise<ConsumerEntity | null>;
    list(filter: ConsumerFilterInfo): Promise<[ConsumerEntity[], number]>;
    delete: (id: string) => Promise<void>;
    assignManyCreators: (
        consumerIds: string[],
        creatorIds: string[],
    ) => Promise<void>;
    removeManyCreators: (
        consumerIds: string[],
        creatorIds: string[],
    ) => Promise<void>;
}
