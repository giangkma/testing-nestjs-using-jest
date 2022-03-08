import { AssignConsumersUseCase } from './assignConsumers.usecase';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([CreatorRepository, ConsumerRepository]),
    ],
    providers: [AssignConsumersUseCase],
    exports: [AssignConsumersUseCase],
})
export class AssignConsumersModule {}
