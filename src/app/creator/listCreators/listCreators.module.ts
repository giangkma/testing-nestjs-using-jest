import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { ListCreatorsUseCase } from './listCreators.usecase';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CreatorRepository])],
    providers: [ListCreatorsUseCase],
    exports: [ListCreatorsUseCase],
})
export class ListCreatorsModule {}
