import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UserRole, userHasRole } from '@src/domain/user';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        const roles = this.reflector.get<UserRole[]>(
            'roles',
            context.getHandler(),
        );

        if (!roles) {
            return true;
        }

        const isValid = user && user.role && userHasRole(user, roles);

        if (!isValid) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        } else {
            return true;
        }
    }
}
