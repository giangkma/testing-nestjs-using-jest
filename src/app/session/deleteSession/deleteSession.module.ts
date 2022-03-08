import { DeleteSessionUseCase } from './deleteSession.usecase';
import { Module } from '@nestjs/common';
import { SessionRepository } from '@src/infra/session/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SessionRepository])],
    providers: [DeleteSessionUseCase],
    exports: [DeleteSessionUseCase],
})
export class DeleteSessionModule {}
