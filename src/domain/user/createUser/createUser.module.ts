import { AuthModule } from '@src/infra/auth/auth.module';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreateUserService } from './createUser.service';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            ConsumerRepository,
            CreatorRepository,
            NextOfKinRepository,
            OrganizationRepository,
            AdminRepository,
        ]),
    ],
    providers: [CreateUserService],
    exports: [CreateUserService],
})
export class CreateUserModule {}
