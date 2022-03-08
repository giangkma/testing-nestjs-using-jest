import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { UserRole } from '@src/domain/user';

// create @Roles() decorator
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
    SetMetadata('roles', roles);
