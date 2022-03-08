import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateConsumerUseCase } from './updateConsumer.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([ConsumerRepository])],
    providers: [UpdateConsumerUseCase],
    exports: [UpdateConsumerUseCase],
})
export class UpdateConsumerModule {}
