import { ConsumerController } from './consumer.controller';
import { CreateConsumerModule } from '@src/app/consumer/createConsumer/createConsumer.module';
import { DeleteConsumerModule } from '@src/app/consumer/deleteConsumer/deleteConsumer.module';
import { GetSingleConsumerModule } from '@src/app/consumer/getSingleConsumer/getSingleConsumer.module';
import { ListConsumersModule } from '@src/app/consumer/listConsumers/listConsumers.module';
import { Module } from '@nestjs/common';
import { UpdateConsumerModule } from '@src/app/consumer/updateConsumer/updateConsumer.module';

@Module({
    imports: [
        GetSingleConsumerModule,
        CreateConsumerModule,
        ListConsumersModule,
        UpdateConsumerModule,
        DeleteConsumerModule,
    ],
    controllers: [ConsumerController],
})
export class ConsumerModule {}
