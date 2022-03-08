import { GetSingleOrganizationUseCase } from './getSingleOrganization.usecase';
import { Module } from '@nestjs/common';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationRepository])],
    providers: [GetSingleOrganizationUseCase],
    exports: [GetSingleOrganizationUseCase],
})
export class GetSingleOrganizationModule {}
