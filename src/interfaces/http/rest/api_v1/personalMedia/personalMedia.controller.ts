import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    ListPersonalMediasRequestObject,
    ListPersonMediasUseCase,
} from '@src/app/personalMedia/listPersonalMedias/listPersonalMedias.usecase';
import {
    RemoveMediaRequestObject,
    RemoveMediaUseCase,
} from '@src/app/personalMedia/removeMedia/removeMedia.usecase';
import {
    UpdateMediaRequestObject,
    UpdateMediaUseCase,
} from '@src/app/personalMedia/updateMedia/updateMedia.usecase';
import {
    UploadMediasRequestObject,
    UploadMediasUseCase,
} from '@src/app/personalMedia/uploadMedias/uploadMedias.usecase';
import { ListResponseData } from '@src/domain/helper/base.dto';
import {
    ListPersonalMediasPayload,
    PersonalMediaEntity,
    RemoveMediaPayload,
    UpdateMediaPayload,
    UploadMediasPayload,
} from '@src/domain/personalMedia';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('personalMedias')
@Controller('personalMedias')
@UseGuards(AppAuthGuard)
export class PersonalMediaController {
    constructor(
        private readonly uploadMediasUseCase: UploadMediasUseCase,
        private readonly removeMediaUseCase: RemoveMediaUseCase,
        private readonly updateMediaUseCase: UpdateMediaUseCase,
        private readonly listPersonMediasUseCase: ListPersonMediasUseCase,
    ) {}
    // TODO: add authentication back when auth service is completed
    @Post('/upload')
    async uploadPersonalMedia(
        @Body() uploadMediasPayload: UploadMediasPayload,
    ): Promise<PersonalMediaEntity> {
        const reqObject = UploadMediasRequestObject.builder(
            uploadMediasPayload,
        );
        const res = await this.uploadMediasUseCase.execute(reqObject);

        return responseHandler<PersonalMediaEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Patch('/media/:id')
    async updateMediaInPersonaledia(
        @Param('id') id: string,
        @Body()
        updateMediaPayload: UpdateMediaPayload,
    ): Promise<PersonalMediaEntity> {
        const reqObject = UpdateMediaRequestObject.builder(
            id,
            updateMediaPayload,
        );

        const res = await this.updateMediaUseCase.execute(reqObject);

        return responseHandler<PersonalMediaEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Get()
    async listPersonalMedias(
        @Query() filter: ListPersonalMediasPayload,
    ): Promise<ListResponseData<PersonalMediaEntity>> {
        const reqObject = ListPersonalMediasRequestObject.builder(filter);
        const res = await this.listPersonMediasUseCase.execute(reqObject);

        return responseHandler<ListResponseData<PersonalMediaEntity>>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Delete('/media/:consumerId')
    async removeMediaInPersonalMedia(
        @Param('consumerId') consumerId: string,
        @Req() req: Request,
        @Body()
        removeMediaPayload: RemoveMediaPayload,
    ): Promise<void> {
        const user = req.user as UserModel;

        const reqObject = RemoveMediaRequestObject.builder(
            consumerId,
            removeMediaPayload,
            user,
        );
        await this.removeMediaUseCase.execute(reqObject);
    }
}
