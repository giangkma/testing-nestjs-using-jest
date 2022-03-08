import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { ListConsumersUseCase } from './listConsumers.usecase';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ConsumerRepository])],
    providers: [ListConsumersUseCase],
    exports: [ListConsumersUseCase],
})
export class ListConsumersModule {}
