import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreateConsumerUseCase } from './createConsumer.usecase';
import { CreateUserModule } from '@src/domain/user/createUser/createUser.module';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '@src/infra/storage/storage.module';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
@Module({
    imports: [
        CreateUserModule,
        StorageModule,
        TypeOrmModule.forFeature([
            ConsumerRepository,
            CreatorRepository,
            OrganizationRepository,
        ]),
    ],
    providers: [CreateConsumerUseCase],
    exports: [CreateConsumerUseCase],
})
export class CreateConsumerModule {}
