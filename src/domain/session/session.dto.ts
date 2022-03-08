import {
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
    ValidateNested,
} from 'class-validator';
import {
    SessionConsumerStatus,
    SessionFilterInfo,
    SessionMedia,
} from '@src/domain/session';

import { BaseListFilterPayload } from '@src/domain/helper/base.dto';
import { ConsumerSessionFilterInfo } from './interfaces';
import { TransformQueryArray } from '@src/helpers/payloadDTO.helper';
import { Type } from 'class-transformer';

/**
 * Session information when create new sesison
 *
 * @export
 * @class Session
 */
export class SessionCreatePayload {
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    consumerIds: string[];

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SessionMedia)
    media: SessionMedia;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdDate?: Date = new Date();
}

/**
 * Update session payload
 *
 * @export {UpdateSessionPayload}
 * @class UpdateSessionPayload
 */
export class UpdateSessionPayload {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SessionMedia)
    media?: SessionMedia;
}

/**
 * Update consumer session payload
 *
 * @export {UpdateConsumerSessionPayload}
 * @class UpdateConsumerSessionPayload
 */
export class UpdateConsumerSessionPayload {
    @IsOptional()
    @IsString()
    feedback?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    playbackCount?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    longestPlayTime?: number;

    @IsOptional()
    @IsEnum(SessionConsumerStatus)
    status?: SessionConsumerStatus;
}

export class SessionListPayload extends BaseListFilterPayload
    implements SessionFilterInfo {
    @IsOptional()
    @IsUUID('all')
    author?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID('all')
    consumerId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sessionIds?: string[];
}

export class ListConsumerSessionsPayload extends BaseListFilterPayload
    implements ConsumerSessionFilterInfo {
    @TransformQueryArray()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    consumerIds?: string[];

    @TransformQueryArray()
    @IsOptional()
    @IsString({ each: true })
    sessionIds?: string[];

    @TransformQueryArray()
    @IsOptional()
    @ArrayUnique()
    @IsEnum(SessionConsumerStatus, { each: true })
    statuses?: SessionConsumerStatus[];
}
