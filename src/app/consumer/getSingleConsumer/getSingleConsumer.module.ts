import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { GetSingleConsumerUseCase } from './getSingleConsumer.usecase';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ConsumerRepository])],
    providers: [GetSingleConsumerUseCase],
    exports: [GetSingleConsumerUseCase],
})
export class GetSingleConsumerModule {}
