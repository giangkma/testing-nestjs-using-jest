import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Local auth guard
 * use instead of AuthGuard('aad') to prevent magic string
 *
 * @export
 * @class AppAuthGuard
 * @extends {AuthGuard('aad')}
 */
@Injectable()
export class AppAuthGuard extends AuthGuard('aad') {}
