import { CreateNextOfKinUseCase } from './createNextOfKin.usecase';
import { CreateUserModule } from '@src/domain/user/createUser/createUser.module';
import { EmailModule } from '@src/infra/email/email.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/infra/user/user.repository';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
@Module({
    imports: [
        CreateUserModule,
        TypeOrmModule.forFeature([
            UserRepository,
            ConsumerRepository,
            NextOfKinRepository,
            CreatorRepository,
            OrganizationRepository,
        ]),
        EmailModule,
    ],
    providers: [CreateNextOfKinUseCase],
    exports: [CreateNextOfKinUseCase],
})
export class CreateNextOfKinModule {}
