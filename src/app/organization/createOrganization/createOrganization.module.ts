import { CreateOrganizationUseCase } from './createOrganization.usecase';
import { CreateUserModule } from '@src/domain/user/createUser/createUser.module';
import { EmailModule } from '@src/infra/email/email.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/infra/user/user.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { StorageModule } from '@src/infra/storage/storage.module';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRepository,
            OrganizationRepository,
            AdminRepository,
        ]),
        CreateUserModule,
        EmailModule,
        StorageModule,
    ],
    providers: [CreateOrganizationUseCase],
    exports: [CreateOrganizationUseCase],
})
export class CreateOrganizationModule {}
