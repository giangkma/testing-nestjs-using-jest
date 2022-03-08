import { CreateCreatorModule } from '@src/app/creator/createCreator/createCreator.module';
import { CreatorController } from './creator.controller';
import { DeleteCreatorModule } from '@src/app/creator/deleteCreator/deleteCreator.module';
import { GetSingleCreatorModule } from '@src/app/creator/getSingleCreator/getSingleCreator.module';
import { ListCreatorsModule } from '@src/app/creator/listCreators/listCreators.module';
import { Module } from '@nestjs/common';
import { UpdateCreatorModule } from '@src/app/creator/updateCreator/updateCreator.module';

@Module({
    imports: [
        CreateCreatorModule,
        DeleteCreatorModule,
        GetSingleCreatorModule,
        UpdateCreatorModule,
        ListCreatorsModule,
    ],
    controllers: [CreatorController],
})
export class CreatorModule {}
