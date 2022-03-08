import { IsNotEmpty, IsString } from 'class-validator';

export enum ContainerType {
    personalMedia = 'pm',
    commonMedia = 'cm',
    avatars = 'avatars',
}

/**
 * SAS auth info
 *
 * @export
 * @class SASInfo
 */
export class SASInfo {
    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsString()
    expiresOn: Date;

    @IsNotEmpty()
    @IsString()
    containerName: string;
}
