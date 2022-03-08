import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';
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

export class AdminProfile extends UserProfile {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @AutoMap()
    @IsNotEmpty()
    @IsPhoneNumber('NO')
    phoneNumber?: string;
}

export class AdminFollowers {
    @AutoMap()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    organizationIds: string[];
}

/**
 * Admin base object
 *
 * @export
 * @class AdminBase
 */
export class AdminBase implements IUser {
    @AutoMap()
    @IsEmail()
    email?: string;

    @AutoMap(() => AdminProfile)
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => AdminProfile)
    profile: AdminProfile;

    @AutoMap(() => AdminFollowers)
    @IsOptional()
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => AdminFollowers)
    followers?: AdminFollowers;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole = UserRole.admin;

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
 * Admin domain entity
 *
 * @export
 * @class AdminEntity
 * @extends {AdminBase}
 */
export class AdminEntity extends AdminBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}
