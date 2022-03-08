import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { DownloadCsvFilterInfo } from './interfaces';
import { TargetEndpoint } from './sessionLog.entity';
import { Type } from 'class-transformer';

export class DownloadCsvPayload implements DownloadCsvFilterInfo {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    userId?: string;

    @IsNotEmpty()
    @IsEnum(TargetEndpoint)
    type: TargetEndpoint;
}
