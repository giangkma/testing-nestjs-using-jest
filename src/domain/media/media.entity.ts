import {
    IsDate,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';

export enum MediaStatus {
    active = 'active',
    deleted = 'deleted',
}

/**
 * Media object
 *
 * @export
 * @class MediaBase
 */
export class MediaBase {
    @AutoMap()
    @IsString()
    creatorId: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    // private consumer media
    consumerId?: string;

    @AutoMap()
    @IsString()
    // media url
    url: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    // media name
    name?: string;

    @AutoMap()
    @IsEnum(MediaStatus)
    status: MediaStatus = MediaStatus.active;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;
}

export class MediaEntity extends MediaBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class MediaInDB extends MediaBase {
    @AutoMap()
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}
