import { ListPersonMediasUseCase } from './listPersonalMedias.usecase';
import { Module } from '@nestjs/common';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([PersonalMediaRepository])],
    providers: [ListPersonMediasUseCase],
    exports: [ListPersonMediasUseCase],
})
export class ListPersonalMediasModule {}
