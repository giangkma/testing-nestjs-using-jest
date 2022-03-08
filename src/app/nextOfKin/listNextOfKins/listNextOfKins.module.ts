import { ListNextOfKinsUseCase } from './listNextOfKins.usecase';
import { Module } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([NextOfKinRepository])],
    providers: [ListNextOfKinsUseCase],
    exports: [ListNextOfKinsUseCase],
})
export class ListNextOfKinsModule {}
