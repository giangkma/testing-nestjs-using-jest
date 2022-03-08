import { Module } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateNextOfKinUseCase } from './updateNextOfKin.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([NextOfKinRepository])],
    providers: [UpdateNextOfKinUseCase],
    exports: [UpdateNextOfKinUseCase],
})
export class UpdateConsumerModule {}
