import { ListSessionsUseCase } from './listSessions.usecase';
import { Module } from '@nestjs/common';
import { SessionRepository } from '@src/infra/session/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SessionRepository])],
    providers: [ListSessionsUseCase],
    exports: [ListSessionsUseCase],
})
export class ListSessionsModule {}
