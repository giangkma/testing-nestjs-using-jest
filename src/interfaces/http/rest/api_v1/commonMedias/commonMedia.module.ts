import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageService } from '@src/infra/storage/storage.service';
import { UserRepository } from '@src/infra/user/user.repository';
import { CommonMediaController } from './commonMedia.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository, OrganizationRepository]),
    ],
    controllers: [CommonMediaController],
    providers: [StorageService],
    exports: [StorageService],
})
export class CommonMediaModule {}
