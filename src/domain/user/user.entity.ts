import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { B2CSignInType } from '@src/infra/auth/msal.service';
import { UserFollowers } from '@src/infra/database/model/user.model';

export enum UserRole {
    admin = 'admin',
    creator = 'creator',
    nextOfKin = 'next-of-kin',
    consumer = 'consumer',
    organization = 'organization',
}

export interface IUser {
    role: UserRole;
    createdDate: Date;
    updatedDate?: Date;
}

export enum UserNameType {
    username = 'username',
    email = 'email',
}

/**
 * User Profile object
 *
 * @export
 * @class UserProfile
 */
export class UserProfile {
    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    avatar?: string;
}

/**
 * User base object
 *
 * @export
 * @class UserBase
 */
export class UserEntity implements IUser {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole;

    @AutoMap()
    @IsOptional()
    @IsString()
    organizationId?: string;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;
}

// -------------------------------------------- //
/**
 *
 * Check user role then return corresponding signin type
 *
 * @param {UserRole} role
 * @returns {B2CSignInType}
 *
 */
export function getUserSignInType(role: UserRole): B2CSignInType {
    let type;

    switch (role) {
        case UserRole.nextOfKin:
            type = B2CSignInType.emailAddress;
            break;
        case UserRole.organization:
            type = B2CSignInType.emailAddress;
            break;
        case UserRole.creator:
            type = B2CSignInType.emailAddress;
            break;
        case UserRole.consumer:
            type = B2CSignInType.userName;
            break;
        case UserRole.admin:
            type = B2CSignInType.emailAddress;
            break;
        default:
            type = B2CSignInType.userName;
            break;
    }

    return type;
}

/**
 *
 * Check user role then return corresponding username type
 *
 * @param {UserRole} role
 * @returns {UserNameType}
 *
 */
export function getUserNameType(role: UserRole): UserNameType {
    let type;

    switch (role) {
        case UserRole.consumer:
            type = UserNameType.username;
            break;
        case UserRole.creator:
        case UserRole.organization:
        case UserRole.nextOfKin:
        case UserRole.admin:
        default:
            type = UserNameType.email;
            break;
    }

    return type;
}

/**
 *
 * Check if an user has a role
 *
 * @param user
 * @param {UserRole} roles
 * @returns {boolean}
 */
export function userHasRole(user: IUser, roles: UserRole[]): boolean {
    return roles.some(role => role === user.role);
}

export const strongPassword = {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    message: 'initialPassword must consist uppercase, lowercase and number',
};

export const mediumPassword = {
    regex: /^(?=.*[a-z])(?=.*[A-Z])/,
    message: 'initialPassword must consist uppercase and lowercase',
};

export const filterFollowers = (followers: UserFollowers): void => {
    if (!followers.creatorIds) {
        delete followers.creatorIds;
    }
    if (!followers.consumerIds) {
        delete followers.consumerIds;
    }
    if (!followers.nextOfKinIds) {
        delete followers.nextOfKinIds;
    }
};
