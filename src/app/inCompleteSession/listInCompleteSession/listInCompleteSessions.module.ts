import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { ListInCompleteSessionsUseCase } from './listInCompleteSessions.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([InCompleteSessionRepository])],
    providers: [ListInCompleteSessionsUseCase],
    exports: [ListInCompleteSessionsUseCase],
})
export class ListInCompleteSessionsModule {}
