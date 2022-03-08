import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { EmailModule } from '@src/infra/email/email.module';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { SessionRepository } from '@src/infra/session/session.repository';
import { CreateSessionUseCase } from './createSession.usecase';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionRepository,
            OrganizationRepository,
            ConsumerRepository,
            NextOfKinRepository,
        ]),
        EmailModule,
    ],
    providers: [CreateSessionUseCase],
    exports: [CreateSessionUseCase],
})
export class CreateSessionModule {}
