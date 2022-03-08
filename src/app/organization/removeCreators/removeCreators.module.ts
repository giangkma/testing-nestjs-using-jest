import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { InCompleteSessionRepository } from '@src/infra/inCompleteSession/inCompleteSession.repository';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { RemoveCreatorsUseCase } from './removeCreators.usecase';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ConsumerRepository,
            CreatorRepository,
            InCompleteSessionRepository,
            NextOfKinRepository,
        ]),
    ],
    providers: [RemoveCreatorsUseCase],
    exports: [RemoveCreatorsUseCase],
})
export class RemoveCreatorsModule {}
