import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { StorageModule } from '@src/infra/storage/storage.module';
import { RemoveMediaUseCase } from './removeMedia.usecase';
@Module({
    imports: [
        StorageModule,
        TypeOrmModule.forFeature([
            PersonalMediaRepository,
            OrganizationRepository,
        ]),
    ],
    providers: [RemoveMediaUseCase],
    exports: [RemoveMediaUseCase],
})
export class RemoveMediaModule {}
