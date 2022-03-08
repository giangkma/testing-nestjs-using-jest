import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { RemoveConsumersUseCase } from './removeConsumers.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([CreatorRepository, ConsumerRepository]),
    ],
    providers: [RemoveConsumersUseCase],
    exports: [RemoveConsumersUseCase],
})
export class RemoveConsumersModule {}
