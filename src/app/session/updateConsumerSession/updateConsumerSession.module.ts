import { Module } from '@nestjs/common';
import { SessionRepository } from '@src/infra/session/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateConsumerSessionUseCase } from './updateConsumerSession.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([SessionRepository])],
    providers: [UpdateConsumerSessionUseCase],
    exports: [UpdateConsumerSessionUseCase],
})
export class UpdateConsumerSessionModule {}
