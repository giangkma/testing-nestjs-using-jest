import { IUser, UserRole } from '@src/domain/user';

import { ConsumerEntity } from '@src/domain/consumer';
import { CreatorEntity } from '@src/domain/creator';
import { NextOfKinEntity } from '@src/domain/nextOfKin';
import { OrganizationEntity } from '@src/domain/organization';
import { AdminEntity } from '../admin';

type Class<T> = new (...args: any[]) => T;

export type UserEntityClass =
    | Class<OrganizationEntity>
    | Class<CreatorEntity>
    | Class<ConsumerEntity>
    | Class<NextOfKinEntity>
    | Class<AdminEntity>;

export const UserRoleEntityMap: Record<UserRole, UserEntityClass> = {
    [UserRole.organization]: OrganizationEntity,
    [UserRole.creator]: CreatorEntity,
    [UserRole.consumer]: ConsumerEntity,
    [UserRole.nextOfKin]: NextOfKinEntity,
    [UserRole.admin]: AdminEntity,
};

export function getUserEntityClass(user: IUser): UserEntityClass {
    return UserRoleEntityMap[user.role];
}
