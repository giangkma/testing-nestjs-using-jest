import { AssignCreatorsUseCase } from './assignCreators.usecase';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ConsumerRepository,
            CreatorRepository,
            NextOfKinRepository,
        ]),
    ],
    providers: [AssignCreatorsUseCase],
    exports: [AssignCreatorsUseCase],
})
export class AssignCreatorsModule {}
