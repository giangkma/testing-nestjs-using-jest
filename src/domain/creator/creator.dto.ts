import {
    ArrayNotEmpty,
    ArrayUnique,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import {
    CreateUserFollowers,
    CreateUserPayload,
    CreateUserProfile,
} from '@src/domain/user/createUser/interfaces';
import { CreatorFollowers, CreatorProfile } from './creator.entity';
import { UserRole, strongPassword } from '@src/domain/user';

import { BaseListFilterPayload } from '@src/domain/helper/base.dto';
import { Type } from 'class-transformer';

/**
 * Create Creator Payload
 *
 * @export
 * @class CreateCreatorPayload
 */
export class CreateCreatorPayload {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreatorProfile)
    profile: CreatorProfile;

    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreatorFollowers)
    followers?: CreatorFollowers;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(strongPassword.regex, {
        message: strongPassword.message,
    })
    initialPassword?: string;

    @IsNotEmpty()
    @IsString()
    organizationId: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    id?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.creator;

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
 * Update Creator Payload
 *
 * @export
 * @class UpdateCreatorPayload
 */
export class UpdateCreatorPayload {
    // creator profile
    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    jobTitle?: string;

    @IsOptional()
    @IsPhoneNumber('NO')
    phoneNumber?: string;

    // creator followers
    @IsOptional()
    @ArrayUnique()
    consumerIds: string[];

    // base info
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    organizationId?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    department?: string;
}

export class ListCreatorsPayload extends BaseListFilterPayload {
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    organizationId?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    department?: string;

    // creator profile
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPhoneNumber('NO')
    phoneNumber?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    jobTitle?: string;

    // creator followers
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    consumerIds?: string[];
}

export class UpdateCreatorFollowersPayload {
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    consumerIds: string[];
}

export const isCreatorProfile = (
    profile: CreateUserProfile,
): profile is CreatorProfile => {
    return (profile as CreatorProfile).firstName != null;
};

export const isCreatorFollowers = (
    followers: CreateUserFollowers,
): followers is CreatorFollowers => {
    return followers && (followers as CreatorFollowers).consumerIds != null;
};

/**
 * Transform 'CreateUserPayload' into 'CreateCreatorPayload'
 * @param {CreateUserPayload} data
 * @returns {CreateCreatorPayload}
 */
export function getCreateCreatorPayload(
    data: CreateUserPayload,
): CreateCreatorPayload {
    const {
        id,
        email,
        profile,
        followers,
        role,
        department,
        organizationId,
        initialPassword,
        createdDate,
        sevenDigitalExpiresAt,
    } = data;

    if (!isCreatorProfile(profile)) throw new Error('invalid creator profile');
    if (!isCreatorFollowers(followers)) {
        throw new Error('invalid creator followers');
    }

    const createCreatorPayload: CreateCreatorPayload = {
        id,
        email,
        profile,
        role,
        department,
        organizationId,
        initialPassword,
        createdDate,
        sevenDigitalExpiresAt,
    };

    if (isCreatorFollowers(followers)) {
        createCreatorPayload.followers = followers;
    }

    return createCreatorPayload;
}
