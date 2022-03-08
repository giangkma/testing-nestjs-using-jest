import { GetSingleCreatorUseCase } from './getSingleCreator.usecase';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorRepository } from '@src/infra/creator/creator.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CreatorRepository])],
    providers: [GetSingleCreatorUseCase],
    exports: [GetSingleCreatorUseCase],
})
export class GetSingleCreatorModule {}
