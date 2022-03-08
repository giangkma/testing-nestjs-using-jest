import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from '../organization/organization.repository';
import { StorageService } from './storage.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationRepository])],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule {}
