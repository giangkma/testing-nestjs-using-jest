import { AuthModule } from '@src/infra/auth/auth.module';
import { DeleteInCompleteSessionUseCase } from './deleteInCompleteSession.usecase';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([InCompleteSessionRepository]),
    ],
    providers: [DeleteInCompleteSessionUseCase],
    exports: [DeleteInCompleteSessionUseCase],
})
export class DeleteInCompleteSessionModule {}
