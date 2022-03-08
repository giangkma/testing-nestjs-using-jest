import {
    ArrayUnique,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { IUser, UserProfile, UserRole } from '../user';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';

/**
 * Creator Profile object
 *
 * @export
 * @class CreatorProfile
 */
export class CreatorProfile extends UserProfile {
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
    phoneNumber: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    jobTitle?: string;
}

/**
 * Update Creator Profile
 *
 * @export
 * @class UpdateCreatorProfile
 */
export class UpdateCreatorProfile extends UserProfile {
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

export class CreatorFollowers {
    @AutoMap()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    consumerIds: string[];

    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    nextOfKinIds?: string[];
}

/**
 * Creator base object
 *
 * @export
 * @class CreatorBase
 */
export class CreatorBase implements IUser {
    @AutoMap()
    @IsEmail()
    email?: string;

    @AutoMap(() => CreatorProfile)
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreatorProfile)
    profile: CreatorProfile;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    organizationId: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    department?: string;

    @AutoMap(() => CreatorFollowers)
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreatorFollowers)
    followers?: CreatorFollowers;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole = UserRole.creator;

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
 * Creator domain entity
 *
 * @export
 * @class CreatorEntity
 * @extends {CreatorBase}
 */
export class CreatorEntity extends CreatorBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}
