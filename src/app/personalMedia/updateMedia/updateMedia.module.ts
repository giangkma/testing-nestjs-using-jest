import { Module } from '@nestjs/common';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateMediaUseCase } from './updateMedia.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([PersonalMediaRepository])],
    providers: [UpdateMediaUseCase],
    exports: [UpdateMediaUseCase],
})
export class UpdateMediaModule {}
