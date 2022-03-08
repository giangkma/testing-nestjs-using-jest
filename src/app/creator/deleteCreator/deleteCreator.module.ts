import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/infra/auth/auth.module';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { DeleteCreatorUseCase } from './deleteCreator.usecase';
@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            CreatorRepository,
            InCompleteSessionRepository,
            ConsumerRepository,
            NextOfKinRepository,
        ]),
    ],
    providers: [DeleteCreatorUseCase],
    exports: [DeleteCreatorUseCase],
})
export class DeleteCreatorModule {}
