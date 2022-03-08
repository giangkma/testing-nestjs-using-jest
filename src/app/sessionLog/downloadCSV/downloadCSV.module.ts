import { DownloadCsvUseCase } from './downloadCSV.usecase';
import { Module } from '@nestjs/common';
import { SessionLogRepository } from '@src/infra/sessionLog/sessionLog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SessionLogRepository])],
    providers: [DownloadCsvUseCase],
    exports: [DownloadCsvUseCase],
})
export class DownloadCsvModule {}
