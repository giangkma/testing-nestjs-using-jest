import {
    IsBooleanString,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { UserRole, strongPassword } from '@src/domain/user';

import { BaseListFilterPayload } from '@src/domain/helper/base.dto';
import { CreateUserPayload } from '@src/domain/user/createUser/interfaces';
import { organizationName, OrganizationProfile } from './organization.entity';
import { Type } from 'class-transformer';
import { User } from '@src/infra/database/model/user.model';

/**
 * Create Organization Payload
 *
 * @export
 * @class CreateOrganizationPayload
 */
export class CreateOrganizationPayload {
    @IsNotEmpty()
    @IsString()
    @MaxLength(23)
    @Matches(organizationName.regex, {
        message: organizationName.message,
    })
    organizationName: string;

    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => OrganizationProfile)
    profile: OrganizationProfile;

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
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    licence: number;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    id?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.organization;

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
 * Update Organization Payload
 *
 * @export
 * @class UpdateOrganizationPayload
 */
export class UpdateOrganizationPayload {
    // Organization profile
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

    // base info
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    licence?: number;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    department?: string;
}

export class ListOrganizationsPayload extends BaseListFilterPayload {
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    department?: string;

    // Organization profile
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
}

/**
 * Transform 'CreateUserPayload' into 'CreateOrganizationPayload'
 * @param {CreateUserPayload} data
 * @returns {CreateOrganizationPayload}
 */
export function getCreateOrganizationPayload(
    data: CreateUserPayload,
): CreateOrganizationPayload {
    const {
        id,
        email,
        profile,
        role,
        licence,
        initialPassword,
        createdDate,
        organizationName,
        sevenDigitalExpiresAt,
    } = data;

    return {
        id,
        email,
        profile,
        licence,
        role,
        initialPassword,
        createdDate,
        organizationName,
        sevenDigitalExpiresAt,
    };
}
