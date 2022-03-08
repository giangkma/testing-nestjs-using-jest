import {
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

import { BaseListFilterPayload } from '../helper/base.dto';
import { Media } from './personalMedia.entity';
import { Type } from 'class-transformer';

/**
 * Upload Personal Media Payload
 *
 * @export
 * @class UploadPersonalMediaPayload
 */
export class UploadMediasPayload {
    @IsNotEmpty()
    @IsString()
    consumerId: string;

    @IsNotEmpty()
    @IsString()
    uploaderId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Media)
    medias: Media[];
}

export class RemoveMediaPayload {
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    mediaIds: string[];
}

export class UpdateMediaPayload {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Media)
    medias: Media[];
}

export class ListPersonalMediasPayload extends BaseListFilterPayload {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    consumerId?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    uploaderId?: string;
}
