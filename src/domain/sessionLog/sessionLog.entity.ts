import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';

export enum TargetEndpoint {
    'preview/log' = 'preview/log',
    'user/subscription/log' = 'user/subscription/log',
    'user/unlimitedStreaming' = 'user/unlimitedStreaming',
}

/**
 * Session log item object
 *
 * @export
 * @class LogItem
 */
export class SessionLogItem {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;

    @AutoMap()
    @IsObject()
    payload: Record<string, unknown>;

    @AutoMap()
    @IsEnum(TargetEndpoint)
    targetEndpoint: TargetEndpoint;

    @AutoMap()
    @IsNotEmpty()
    time: Date;

    @AutoMap()
    @IsOptional()
    @IsDate()
    error?: Record<string, unknown>;
}

/**
 * Session log base object
 *
 * @export
 * @class SessionLogBase
 */
export class SessionLogBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @AutoMap(() => SessionLogItem)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SessionLogItem)
    items: SessionLogItem[];

    @AutoMap()
    @IsNumber()
    count: number;

    @AutoMap()
    @IsDate()
    startTime: Date;

    @AutoMap()
    @IsDate()
    endTime: Date;
}

/**
 * Session log domain entity
 *
 * @export
 * @class SessionLogEntity
 * @extends {SessionLogBase}
 */
export class SessionLogEntity extends SessionLogBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}

export interface CsvColumn {
    key: string;
    header: string;
}

/**
 * Csv columns
 * @export {SessionLogCsvColumns}
 *
 */
export const SessionLogCsvColumns = {
    // Preview Stream Log Template
    'preview/log': [
        { key: 'country', header: 'COUNTRY' },
        { key: 'trackId', header: 'TRACKID' },
        { key: 'userAgent', header: 'USERAGENT' },
        { key: 'dateTimePlayed', header: 'DATETIMEPLAYED' },
        { key: 'totalTimePlayed', header: 'TOTALTIMEPLAYED' },
        { key: 'userId', header: 'USERID' },
        { key: 'playMode', header: 'PLAYMODE' },
        { key: 'endReason', header: 'ENDREASON' },
    ],
    //Subscription Stream Log Template
    'user/subscription/log': [
        { key: 'userId', header: 'USERID' },
        { key: 'country', header: 'COUNTRY' },
        { key: 'trackId', header: 'TRACKID' },
        { key: 'releaseId', header: 'RELEASEID' },
        { key: 'formatId', header: 'FORMATID' },
        { key: 'userAgent', header: 'USERAGENT' },
        { key: 'dateTimePlayed', header: 'DATETIMEPLAYED' },
        { key: 'totalTimePlayed', header: 'TOTALTIMEPLAYED' },
        { key: 'playMode', header: 'PLAYMODE' },
    ],
    // Subscription User Log Template (request done to the unlimitedStreaming endpoint)
    'user/unlimitedStreaming': [
        { key: 'userId', header: 'USERID' },
        { key: 'planCode', header: 'PLANCODE' },
        { key: 'status', header: 'STATUS' },
        { key: 'country', header: 'COUNTRY' },
        { key: 'currency', header: 'CURRENCY' },
        { key: 'recurringFee', header: 'RECURRINGFEE' },
        { key: 'postcode', header: 'POSTCODE' },
        { key: 'activatedAt', header: 'ACTIVATEDAT' },
        { key: 'currentPeriodStartDate', header: 'CURRENTPERIODSTARTDATE' },
        { key: 'trialEndsAt', header: 'TRIALENDSAT' },
        { key: 'expiryDate', header: 'EXPIRYDATE' },
    ],
};

/**
 * Use session log type to create corresponding csv columns
 *
 * @param {TargetEndpoint} sessionLogType
 * @returns {CsvColumn[]}
 */
export const getCsvColumnsByType = (
    sessionLogType: TargetEndpoint,
): CsvColumn[] => {
    let columns;

    switch (sessionLogType) {
        case TargetEndpoint['preview/log']:
            columns = SessionLogCsvColumns['preview/log'];
            break;
        case TargetEndpoint['user/subscription/log']:
            columns = SessionLogCsvColumns['user/subscription/log'];
            break;
        case TargetEndpoint['user/unlimitedStreaming']:
            columns = SessionLogCsvColumns['user/unlimitedStreaming'];
            break;
        default:
            break;
    }

    return columns;
};

/**
 * Use session log type to create corresponding csv file name
 *
 * @param {string} sessionLogType
 * @returns {string}
 */
export const logEndpointCSVFileName = (
    sessionLogType: TargetEndpoint,
): string => {
    return `${sessionLogType.replace('/', '-')}.csv`;
};
