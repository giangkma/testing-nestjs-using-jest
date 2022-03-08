import { IUser, UserRole } from '../user';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';
import { UserProfile } from '../user';
import { User } from '@src/infra/database/model/user.model';
import { UserModel } from '@src/infra/database/model';

/**
 * Organization Profile object
 *
 * @export
 * @class OrganizationProfile
 */
export class OrganizationProfile extends UserProfile {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    name?: string;

    @AutoMap()
    @IsNotEmpty()
    @IsPhoneNumber('NO')
    phoneNumber?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    jobTitle?: string;
}

/**
 * Update Organization Profile
 *
 * @export
 * @class UpdateOrganizationProfile
 */
export class UpdateOrganizationProfile extends UserProfile {
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
 * Organization base object
 *
 * @export
 * @class OrganizationBase
 */
export class OrganizationBase implements IUser {
    @AutoMap()
    @IsEmail()
    email?: string;

    @AutoMap(() => OrganizationProfile)
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => OrganizationProfile)
    profile?: OrganizationProfile;

    @AutoMap()
    @IsOptional()
    @IsString()
    department?: string;

    @AutoMap()
    @IsNumber()
    licence?: number;

    @AutoMap()
    @IsString()
    organizationName?: string;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole = UserRole.organization;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;

    @AutoMap()
    @IsOptional()
    @IsDate()
    sevenDigitalExpiresAt?: Date;
}

/**
 * Organization domain entity
 *
 * @export
 * @class OrganizationEntity
 * @extends {OrganizationBase}
 */
export class OrganizationEntity extends OrganizationBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}

export const organizationName = {
    regex: /^[a-zA-Z0-9_ ]*$/,
    message: 'Organization name does not include special characters',
};

export function getOrganizationId(user: UserModel): string {
    return user.organizationId ?? user._id;
}

export function formatOrganzationName(organizationName: string): string {
    return organizationName.replace(/\s+/g, '').toLocaleLowerCase();
}
