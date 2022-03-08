import { IsEmail, IsNotEmpty } from 'class-validator';

import { UserRole } from './user.entity';

export interface UserFilterInfo {
    role?: UserRole;
}

export class CheckEmailExistsParams {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
