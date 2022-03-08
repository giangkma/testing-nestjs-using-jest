import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';

/**
 * Media object
 *
 * @export
 * @class Media
 */
export class Media {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;

    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    type?: string;

    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @AutoMap()
    @IsOptional()
    metaData?: Record<string, unknown>;
}

/**
 * Personal Media base object
 *
 * @export
 * @class PersonalMediaBase
 */
export class PersonalMediaBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    consumerId: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    uploaderId: string;

    @AutoMap(() => Media)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Media)
    medias: Media[];

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;
}

/**
 * Personal media domain entity
 *
 * @export
 * @class PersonalMediaEntity
 * @extends {PersonalMediaBase}
 */
export class PersonalMediaEntity extends PersonalMediaBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}
