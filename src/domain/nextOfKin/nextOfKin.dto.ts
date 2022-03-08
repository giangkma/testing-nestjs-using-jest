import {
    ArrayUnique,
    IsBoolean,
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
import { NextOfKinFollowers, NextOfKinProfile } from './nextOfKin.entity';
import { UserRole, strongPassword } from '../user';

import { BaseListFilterPayload } from '@src/domain/helper/base.dto';
import { NextOfKinFilterInfo } from './interfaces';
import { TransformQueryArray } from '@src/helpers/payloadDTO.helper';
import { Type } from 'class-transformer';

export class CreateNextOfKinPayload {
    @IsNotEmpty()
    @IsEmail()
    email: string;

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
    @IsBoolean()
    consent?: boolean;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NextOfKinProfile)
    profile: NextOfKinProfile;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.nextOfKin;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    id?: string;

    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NextOfKinFollowers)
    followers?: NextOfKinFollowers;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdDate?: Date = new Date();
}

/**
 *
 * @export
 * @class UpdateNextOfKinPayload
 */
export class UpdateNextOfKinPayload {
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
    @IsNotEmpty()
    @IsPhoneNumber('NO')
    phoneNumber: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    organizationId?: string;

    @IsOptional()
    @ArrayUnique()
    consumerIds: string[];

    @IsOptional()
    @ArrayUnique()
    creatorIds: string[];

    @IsOptional()
    @IsBoolean()
    consent?: boolean;
}

/**
 *
 * @class ListNextOfKinsPayload
 *
 */
export class ListNextOfKinsPayload extends BaseListFilterPayload
    implements NextOfKinFilterInfo {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    organizationId?: string;

    @TransformQueryArray()
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    consumerIds?: string[];
}

export const isNextOfKinProfile = (
    profile: CreateUserProfile,
): profile is NextOfKinProfile => {
    return (profile as NextOfKinProfile).firstName != null;
};

export const isNextOfKinFollowers = (
    followers: CreateUserFollowers,
): followers is NextOfKinFollowers => {
    return followers && (followers as NextOfKinFollowers).consumerIds != null;
};

/**
 * Transform 'CreateUserPayload' into 'CreateNextOfKinPayload'
 * @param {CreateUserPayload} data
 * @returns {CreateNextOfKinPayload}
 */
export function getCreateNextOfKinPayload(
    data: CreateUserPayload,
): CreateNextOfKinPayload {
    const {
        id,
        email,
        profile,
        followers,
        role,
        organizationId,
        initialPassword,
        createdDate,
        consent,
    } = data;

    if (!isNextOfKinProfile(profile))
        throw new Error('invalid next-of-kin profile');

    if (!isNextOfKinFollowers(followers)) {
        throw new Error('invalid next-of-kin followers');
    }

    const createNextOfKinPayload: CreateNextOfKinPayload = {
        id,
        email,
        profile,
        role,
        organizationId,
        initialPassword,
        createdDate,
        consent,
    };

    if (isNextOfKinFollowers(followers)) {
        // If 'followers' field has value and valid type
        // then add to createNextOfKinPayload
        createNextOfKinPayload.followers = followers;
    }

    return createNextOfKinPayload;
}
