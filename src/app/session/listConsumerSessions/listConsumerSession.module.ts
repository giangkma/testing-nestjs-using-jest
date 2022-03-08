import { ListConsumerSessionsUseCase } from './listConsumerSessions.usecase';
import { Module } from '@nestjs/common';
import { SessionRepository } from '@src/infra/session/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SessionRepository])],
    providers: [ListConsumerSessionsUseCase],
    exports: [ListConsumerSessionsUseCase],
})
export class ListConsumerSessionsModule {}
