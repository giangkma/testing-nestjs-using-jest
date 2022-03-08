import { Module } from '@nestjs/common';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateOrganizationUseCase } from './updateOrganization.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationRepository])],
    providers: [UpdateOrganizationUseCase],
    exports: [UpdateOrganizationUseCase],
})
export class UpdateOrganizationModule {}
