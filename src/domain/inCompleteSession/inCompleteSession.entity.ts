import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';
import { ContainerType } from '../storage';

/**
 * Image Selection base object
 *
 * @exports ImageSelection
 * @class ImageSelection
 */
export class ImageSelection {
    @AutoMap()
    @IsString()
    id: string;

    @AutoMap()
    @IsEnum(ContainerType)
    containerType: ContainerType;

    @AutoMap()
    @IsString()
    @IsOptional()
    description?: string;
}

/**
 * Track audio selection base object
 * @exports TrackSelection
 * @class TrackSelection
 */
export class TrackSelection {
    @AutoMap()
    @IsNumber()
    id: number;

    @AutoMap()
    @IsNumber()
    releaseId: number;

    @AutoMap()
    @IsString()
    artist: string;

    @AutoMap()
    @IsString()
    title: string;

    @AutoMap()
    @IsNumber()
    duration: number;

    @AutoMap()
    @IsString()
    cover: string;
}

/**
 * Recipient profile base object
 * @exports RecipientProfile
 * @class RecipientProfile
 */
export class RecipientProfile {
    @AutoMap()
    @IsString()
    firstName: string;

    @AutoMap()
    @IsString()
    lastName: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    avatar?: string;
}

/**
 * Recipient Infomation
 * @exports Recipient
 * @class Recipient
 */
export class Recipient {
    @AutoMap()
    @IsString()
    id: string;

    @AutoMap(() => RecipientProfile)
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RecipientProfile)
    profile: RecipientProfile;
}

/**
 * InComplete form states object
 * @export SessionForm
 * @class SessionForm
 */
export class SessionForm {
    @AutoMap()
    @IsString()
    name: string;

    @AutoMap(() => ImageSelection)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageSelection)
    images: ImageSelection[];

    @AutoMap(() => TrackSelection)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TrackSelection)
    trackSelection: TrackSelection[];

    @AutoMap()
    @IsString()
    title: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    notes?: string;

    // TODO: should store recipient as user id, do not need store recipient profile
    // since can use aggregation entity which was provided by typeorm repository to reference user model
    @AutoMap(() => Recipient)
    @ValidateNested()
    @Type(() => Recipient)
    recipient: Recipient;

    // TODO: Should remove this field in the future since we can deduct that from music / video durations
    // and storing deductable variable like that might lead to inconsistent data bug later
    @AutoMap()
    @IsNumber()
    totalDuration: number;

    @AutoMap()
    @IsNumber()
    @Min(1)
    @Max(5)
    step: number;
}

/**
 * InComplete session entity
 * @exports InCompleteSessionEntity
 * @class InCompleteSessionEntity
 */
export class InCompleteSessionEntity {
    @AutoMap()
    @IsString()
    readonly id: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    author: string; // creator id or organization id

    @AutoMap(() => SessionForm)
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => SessionForm)
    sessionForm: SessionForm;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;
}
