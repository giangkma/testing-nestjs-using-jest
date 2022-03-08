import { BaseListFilterInfo } from '@src/domain/helper/base.dto';
import { TargetEndpoint } from './sessionLog.entity';

export interface DownloadCsvFilterInfo extends BaseListFilterInfo {
    startTime: Date;
    endTime: Date;
    userId?: string;
    type: TargetEndpoint;
}
