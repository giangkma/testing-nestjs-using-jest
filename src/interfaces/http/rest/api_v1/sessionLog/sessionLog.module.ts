import { DownloadCsvModule } from '@src/app/sessionLog/downloadCSV/downloadCSV.module';
import { LogController } from './sessionLog.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [DownloadCsvModule],
    controllers: [LogController],
})
export class SessionLogModule {}
