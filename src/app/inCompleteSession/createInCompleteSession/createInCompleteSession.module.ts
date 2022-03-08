import { CreateInCompleteSessionUseCase } from './createInCompleteSession.usecase';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([InCompleteSessionRepository])],
    providers: [CreateInCompleteSessionUseCase],
    exports: [CreateInCompleteSessionUseCase],
})
export class CreateInCompleteSessionModule {}
