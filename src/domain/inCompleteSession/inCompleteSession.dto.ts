import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

import {
    ImageSelection,
    Recipient,
    SessionForm,
    TrackSelection,
} from './inCompleteSession.entity';
import { Type } from 'class-transformer';
import { BaseListFilterPayload } from '../helper/base.dto';
import { InCompleteSessionsFilterInfo } from './interfaces';

export class CreateInCompleteSessionPayload {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SessionForm)
    sessionForm: SessionForm;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdDate?: Date = new Date();
}

export class ListInCompleteSessionsPayload extends BaseListFilterPayload
    implements InCompleteSessionsFilterInfo {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    author?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;
}

/**
 * Update session payload
 *
 * @export {UpdateInCompleteSessionPayload}
 * @class UpdateInCompleteSessionPayload
 */
export class UpdateInCompleteSessionPayload {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageSelection)
    images?: ImageSelection[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TrackSelection)
    trackSelection?: TrackSelection[];

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    // TODO: should store recipient as user id, do not need store recipient profile
    // since can use aggregation entity which was provided by typeorm repository to reference user model
    @IsOptional()
    @ValidateNested()
    @Type(() => Recipient)
    recipient?: Recipient;

    // TODO: Should remove this field in the future since we can deduct that from music / video durations
    // and storing deductable variable like that might lead to inconsistent data bug later
    @IsOptional()
    @IsNumber()
    totalDuration?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    step?: number;
}
