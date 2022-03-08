import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateCreatorUseCase } from './updateCreator.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([CreatorRepository])],
    providers: [UpdateCreatorUseCase],
    exports: [UpdateCreatorUseCase],
})
export class UpdateCreatorModule {}
