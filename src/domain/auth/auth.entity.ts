import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthToken {
    @IsNotEmpty()
    @IsString()
    accessToken: string;
}

/**
 * Creator auth info
 *
 * @export
 * @class CreatorAuthInfo
 */
export class CreatorAuthInfo {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}

/**
 * Creator signup info
 *
 * @export
 * @class CreatorSignUpInfo
 */
export class CreatorSignUpInfo {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}

/**
 * Consumer ( Patient ) auth info
 *
 * @export
 * @class ConsumerAuthInfo
 */
export class ConsumerAuthInfo {
    @IsNotEmpty()
    @IsString()
    username: string;
}
