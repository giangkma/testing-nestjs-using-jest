import { AuthModule } from '@src/infra/auth/auth.module';
import { DeleteOrganizationUseCase } from './deleteOrganization.usecase';
import { Module } from '@nestjs/common';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([OrganizationRepository, AdminRepository]),
    ],
    providers: [DeleteOrganizationUseCase],
    exports: [DeleteOrganizationUseCase],
})
export class DeleteOrganizationModule {}
