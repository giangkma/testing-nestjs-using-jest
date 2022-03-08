import { ListPersonalMediasModule } from '@src/app/personalMedia/listPersonalMedias/listPersonalMedias.module';
import { Module } from '@nestjs/common';
import { PersonalMediaController } from './personalMedia.controller';
import { RemoveMediaModule } from '@src/app/personalMedia/removeMedia/removeMedia.module';
import { UpdateMediaModule } from '@src/app/personalMedia/updateMedia/updateMedia.module';
import { UploadMediasModule } from '@src/app/personalMedia/uploadMedias/uploadMedias.module';
@Module({
    imports: [
        UploadMediasModule,
        RemoveMediaModule,
        UpdateMediaModule,
        ListPersonalMediasModule,
    ],
    controllers: [PersonalMediaController],
})
export class PersonalMediaModule {}
