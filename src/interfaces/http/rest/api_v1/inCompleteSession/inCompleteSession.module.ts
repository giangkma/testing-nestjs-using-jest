import { CreateInCompleteSessionModule } from '@src/app/inCompleteSession/createInCompleteSession/createInCompleteSession.module';
import { DeleteInCompleteSessionModule } from '@src/app/inCompleteSession/deleteInCompleteSession/deleteInCompleteSession.module';
import { GetSingleInCompleteSessionModule } from '@src/app/inCompleteSession/getSingleInCompleteSession/getSingleInCompleteSession.module';
import { InCompleteSessionController } from './inCompleteSession.controller';
import { Module } from '@nestjs/common';
import { ListInCompleteSessionsModule } from '@src/app/inCompleteSession/listInCompleteSession/listInCompleteSessions.module';
import { UpdateInCompleteSessionModule } from '@src/app/inCompleteSession/updateInCompleteSession/updateInCompleteSession.module';
@Module({
    imports: [
        ListInCompleteSessionsModule,
        CreateInCompleteSessionModule,
        GetSingleInCompleteSessionModule,
        DeleteInCompleteSessionModule,
        UpdateInCompleteSessionModule,
    ],
    controllers: [InCompleteSessionController],
})
export class InCompleteSessionModule {}
