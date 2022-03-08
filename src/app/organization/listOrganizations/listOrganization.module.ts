import { ListOrganizationsUseCase } from './listOrganizations.usecase';
import { Module } from '@nestjs/common';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationRepository])],
    providers: [ListOrganizationsUseCase],
    exports: [ListOrganizationsUseCase],
})
export class ListOrganizationsModule {}
