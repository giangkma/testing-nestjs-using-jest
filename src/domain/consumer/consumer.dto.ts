import {
    ArrayNotEmpty,
    ArrayUnique,
    IsBooleanString,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import {
    ConsumerFilterInfo,
    ConsumerProfile,
    SurveyForm,
} from '@src/domain/consumer';
import {
    CreateUserFollowers,
    CreateUserPayload,
    CreateUserProfile,
} from '@src/domain/user/createUser/interfaces';
import { UserProfile, UserRole, mediumPassword } from '@src/domain/user';

import { BaseListFilterPayload } from '@src/domain/helper/base.dto';
import { ConsumerFollowers } from './consumer.entity';
import { TransformQueryArray } from '@src/helpers/payloadDTO.helper';
import { Type } from 'class-transformer';

/**
 * Consumer information when create new consumer
 *
 * @export
 * @class CreateConsumerPayload
 */

export class CreateConsumerPayload {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => ConsumerProfile)
    profile: ConsumerProfile;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(mediumPassword.regex, {
        message: mediumPassword.message,
    })
    initialPassword: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SurveyForm)
    surveyForm?: SurveyForm;

    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => ConsumerFollowers)
    followers?: ConsumerFollowers;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.consumer;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    id?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    organizationId?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdDate?: Date = new Date();

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    sevenDigitalExpiresAt?: Date;
}

/**
 * Consumer profile data
 *
 * @exports
 * @class UpdateConsumerProfile
 */
export class UpdateConsumerProfile extends UserProfile {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;
}

/**
 * Consumer info when update consumer
 *
 * @export
 * @class UpdateConsumerPayload
 */
export class UpdateConsumerPayload {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SurveyForm)
    surveyForm?: SurveyForm;
}

export class ListConsumersPayload extends BaseListFilterPayload
    implements ConsumerFilterInfo {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    username?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    organizationId?: string;

    @TransformQueryArray()
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    creatorIds?: string[];
}

export class ConsumerDetailedFilterPayload {
    @IsOptional()
    @IsBooleanString()
    name?: boolean;
}
export class UpdateConsumerFollowersPayload {
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    creatorIds: string[];
}

export const isConsumerProfile = (
    profile: CreateUserProfile,
): profile is ConsumerProfile => {
    return (profile as ConsumerProfile).firstName != null;
};

export const isConsumerFollowers = (
    followers: CreateUserFollowers,
    profile?: CreateUserProfile,
): followers is ConsumerFollowers => {
    return (
        isConsumerProfile(profile) ||
        (followers && (followers as ConsumerFollowers).creatorIds != null)
    );
};

/**
 * Transform 'CreateUserPayload' into 'CreateConsumerPayload'
 * @param {CreateUserPayload} data
 * @returns {CreateConsumerPayload}
 */
export function getCreateConsumerPayload(
    data: CreateUserPayload,
): CreateConsumerPayload {
    const {
        username,
        profile,
        initialPassword,
        surveyForm,
        followers,
        role,
        organizationId,
        id,
        createdDate,
        sevenDigitalExpiresAt,
    } = data;

    if (!isConsumerProfile(profile))
        throw new Error('invalid consumer profile');

    if (!isConsumerFollowers(followers, profile)) {
        throw new Error('invalid consumer followers');
    }

    const createConsumerPayload: CreateConsumerPayload = {
        username,
        profile,
        initialPassword,
        surveyForm,
        role,
        organizationId,
        id,
        createdDate,
        sevenDigitalExpiresAt,
    };

    if (isConsumerFollowers(followers, profile)) {
        createConsumerPayload.followers = followers;
    }

    return createConsumerPayload;
}
