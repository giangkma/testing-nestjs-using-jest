import { Controller, Get, Res, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DownloadCsvPayload } from '@src/domain/sessionLog';
import { DownloadCsvUseCase } from '@src/app/sessionLog/downloadCSV/downloadCSV.usecase';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole } from '@src/domain/user';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('sessionLogs')
@Controller('sessionLogs')
@UseGuards(AppAuthGuard)
export class LogController {
    constructor(private readonly downloadCsvUseCase: DownloadCsvUseCase) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization)
    async downloadCSV(
        @Query() filter: DownloadCsvPayload,
        @Res() res: Response,
    ): Promise<any> {
        const {
            cursor,
            fileName,
        } = await this.downloadCsvUseCase.processRequest(filter);

        // Set approrpiate download headers
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-disposition': `attachment; filename=${fileName}`,
        });

        // Pipe/stream the query result to the response via the CSV transformer stream
        await cursor.pipe(res);
    }
}
