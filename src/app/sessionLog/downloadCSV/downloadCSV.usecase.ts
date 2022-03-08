import * as stringify from 'csv-stringify';

import {
    DownloadCsvPayload,
    getCsvColumnsByType,
    logEndpointCSVFileName,
} from '@src/domain/sessionLog';

import { Injectable } from '@nestjs/common';
import { SessionLogRepository } from '@src/infra/sessionLog/sessionLog.repository';

interface DownloadCsvUseCaseResult {
    cursor: stringify.Stringifier;
    fileName: string;
}

@Injectable()
export class DownloadCsvUseCase {
    constructor(private readonly sessionLogRepository: SessionLogRepository) {}

    processRequest(filter: DownloadCsvPayload): DownloadCsvUseCaseResult {
        const fileName = logEndpointCSVFileName(filter.type);

        const getCursor = this.sessionLogRepository.getCursor(filter);
        const columns = getCsvColumnsByType(filter.type);

        const cursor = getCursor.pipe(
            stringify({
                header: true,
                columns,
            }),
        );

        return {
            cursor,
            fileName,
        };
    }
}
