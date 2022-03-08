import { Module } from '@nestjs/common';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadMediasUseCase } from './uploadMedias.usecase';
import { EmailModule } from '@src/infra/email/email.module';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonalMediaRepository,
            NextOfKinRepository,
            CreatorRepository,
            OrganizationRepository,
            ConsumerRepository,
        ]),
        EmailModule,
    ],
    providers: [UploadMediasUseCase],
    exports: [UploadMediasUseCase],
})
export class UploadMediasModule {}
