import { AdminFollowers, AdminProfile } from '@src/domain/admin';
import {
    ConsumerFollowers,
    ConsumerProfile,
    SurveyForm,
} from '@src/domain/consumer/consumer.entity';
import {
    CreatorFollowers,
    CreatorProfile,
} from '@src/domain/creator/creator.entity';
import {
    NextOfKinFollowers,
    NextOfKinProfile,
} from '@src/domain/nextOfKin/nextOfKin.entity';

import { OrganizationProfile } from '@src/domain/organization/organization.entity';
import { UserRole } from '@src/domain/user';

export type CreateUserProfile =
    | ConsumerProfile
    | CreatorProfile
    | NextOfKinProfile
    | OrganizationProfile
    | AdminProfile;

export type CreateUserFollowers =
    | ConsumerFollowers
    | CreatorFollowers
    | NextOfKinFollowers
    | AdminFollowers;

export interface CreateUserPayload {
    id?: string;
    username?: string;
    email?: string;
    profile: CreateUserProfile;
    surveyForm?: SurveyForm;
    initialPassword?: string;
    followers?: CreateUserFollowers;
    role?: UserRole;
    organizationId?: string;
    department?: string;
    licence?: number;
    createdDate?: Date;
    organizationName?: string;
    sevenDigitalExpiresAt?: Date;
    consent?: boolean;
}
