import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Min,
    ValidateNested,
} from 'class-validator';

import { TransformQueryNumber } from '@src/helpers/payloadDTO.helper';

export interface BaseListFilterInfo {
    limit?: number;
    pageIndex?: number;
}

export interface BaseResponseData {
    data: string;
}

export class BaseListFilterPayload implements BaseListFilterInfo {
    @IsOptional()
    @IsNumber()
    @TransformQueryNumber()
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @TransformQueryNumber()
    pageIndex?: number;
}

class ListResponseInfo {
    @IsNumber()
    total: number;

    @IsNumber()
    pageSize: number;

    @IsNumber()
    pageIndex: number;
}

export class BaseListResponseDTO {
    @IsNotEmpty()
    @ValidateNested()
    info: ListResponseInfo;
}

export class ListResponseData<T> extends BaseListResponseDTO {
    @IsArray()
    data: T[];
}
