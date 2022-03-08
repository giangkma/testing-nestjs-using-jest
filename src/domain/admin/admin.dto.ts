import { strongPassword, UserRole } from '@src/domain/user';
import { CreateUserPayload } from '@src/domain/user/createUser/interfaces';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
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
import { AdminProfile } from './admin.entity';

/**
 * Create Admin Payload
 *
 * @export
 * @class CreateAdminPayload
 */
export class CreateAdminPayload {
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => AdminProfile)
    profile: AdminProfile;

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

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    id?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.admin;

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
 * Transform 'CreateUserPayload' into 'CreateAdminPayload'
 * @param {CreateUserPayload} data
 * @returns {CreateAdminPayload}
 */
export function getCreateAdminPayload(
    data: CreateUserPayload,
): CreateAdminPayload {
    const {
        id,
        email,
        profile,
        role,
        initialPassword,
        createdDate,
        sevenDigitalExpiresAt,
    } = data;

    return {
        id,
        email,
        profile,
        role,
        initialPassword,
        createdDate,
        sevenDigitalExpiresAt,
    };
}
