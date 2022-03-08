import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';
import { ContainerType } from '../storage';

export enum SessionConsumerStatus {
    active = 'active',
    inactive = 'inactive',
}

/**
 * Session's image object
 *
 * @export {SessionImage}
 * @class Session image
 */
export class SessionImage {
    @AutoMap()
    @IsString()
    id: string;

    @AutoMap()
    @IsEnum(ContainerType)
    containerType: ContainerType;
}

/**
 * Session's audio object
 *
 * @export {SessionAudio}
 * @class Session audio
 */
export class SessionAudio {
    @AutoMap()
    @IsString()
    trackId: string; // 7digital track id

    @AutoMap()
    @IsNumber()
    releaseId: number; // 7digital release id
}

/**
 * Session's media object
 *
 * @export {SessionMedia}
 * @class Session Media
 */
export class SessionMedia {
    @AutoMap(() => SessionImage)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SessionImage)
    images?: SessionImage[]; // array of images that stored on azure storage

    @AutoMap()
    @IsOptional()
    @IsNumber()
    imageDuration?: number; // image duration in second, only need if images are uploaded

    @AutoMap(() => SessionAudio)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SessionAudio)
    audios?: SessionAudio[];

    @AutoMap()
    @IsOptional()
    @IsString()
    video?: string; // video url
}

/**
 * Session base object
 *
 * @export
 * @class SessionBase
 */
export class SessionBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    author: string; // creatorId or organizationId

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    title: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    notes?: string;

    @AutoMap()
    @IsString()
    thumbnail: string;

    @AutoMap(() => SessionMedia)
    @IsNotEmpty()
    @ValidateNested()
    media: SessionMedia;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;
}

/**
 * Consumer domain entity
 *
 * @export
 * @class SessionEntity
 * @extends {SessionBase}
 */
export class SessionEntity extends SessionBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class SessionConsumerEntity {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    sessionId: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    consumerId: string;

    @AutoMap()
    @IsEnum(SessionConsumerStatus)
    status: SessionConsumerStatus = SessionConsumerStatus.active;

    @AutoMap()
    @IsOptional()
    @IsNumber()
    playbackCount? = 0;

    @AutoMap()
    @IsOptional()
    @IsString()
    feedback?: string;

    /** Longest play time in second */
    @AutoMap()
    @IsOptional()
    @IsNumber()
    longestPlayTime? = 0;

    @AutoMap()
    @IsDate()
    @Type(() => Date)
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    updatedDate?: Date;
}
