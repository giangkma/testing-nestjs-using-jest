import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { UpdateInCompleteSessionUseCase } from './updateInCompleteSession.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([InCompleteSessionRepository])],
    providers: [UpdateInCompleteSessionUseCase],
    exports: [UpdateInCompleteSessionUseCase],
})
export class UpdateInCompleteSessionModule {}
