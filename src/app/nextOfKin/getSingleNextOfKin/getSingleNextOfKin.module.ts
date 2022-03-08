import { GetSingleNextOfKinUseCase } from './getSingleNextOfKin.usecase';
import { Module } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([NextOfKinRepository])],
    providers: [GetSingleNextOfKinUseCase],
    exports: [GetSingleNextOfKinUseCase],
})
export class GetSingleNextOfKinModule {}
