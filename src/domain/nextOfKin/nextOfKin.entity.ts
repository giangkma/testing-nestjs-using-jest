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
    ValidateNested,
} from 'class-validator';
import { IUser, UserProfile, UserRole } from '../user';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';

export class NextOfKinProfile extends UserProfile {
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
    @IsNotEmpty()
    @IsPhoneNumber('NO')
    phoneNumber: string;
}

export class NextOfKinFollowers {
    @AutoMap()
    @IsNotEmpty()
    @ArrayUnique()
    consumerIds?: string[];

    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    creatorIds?: string[];
}

/**
 * NextOfKin base object
 *
 * @export
 * @class NextOfKinBase
 */
export class NextOfKinBase implements IUser {
    @AutoMap()
    @IsEmail()
    email: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    organizationId: string;

    @AutoMap(() => NextOfKinProfile)
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NextOfKinProfile)
    profile?: NextOfKinProfile;

    @AutoMap(() => NextOfKinFollowers)
    @IsOptional()
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => NextOfKinFollowers)
    followers?: NextOfKinFollowers;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole = UserRole.nextOfKin;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;

    @AutoMap()
    @IsBoolean()
    consent = false;
}

/**
 * Creator NextOfKin entity
 *
 * @export
 * @class NextOfKinEntity
 * @extends {NextOfKinBase}
 */
export class NextOfKinEntity extends NextOfKinBase {
    @AutoMap()
    @IsString()
    @IsNotEmpty()
    id: string;
}
