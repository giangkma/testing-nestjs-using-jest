import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/infra/auth/auth.module';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageModule } from '@src/infra/storage/storage.module';
import { DeleteConsumerUseCase } from './deleteConsumer.usecase';

@Module({
    imports: [
        AuthModule,
        StorageModule,
        TypeOrmModule.forFeature([
            ConsumerRepository,
            InCompleteSessionRepository,
            OrganizationRepository,
            NextOfKinRepository,
            CreatorRepository,
        ]),
    ],
    providers: [DeleteConsumerUseCase],
    exports: [DeleteConsumerUseCase],
})
export class DeleteConsumerModule {}
