import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Patch,
    Delete,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
    CreateCreatorRequestObject,
    CreateCreatorUseCase,
} from '@src/app/creator/createCreator/createCreator.usecase';
import {
    GetSingleCreatorRequestObject,
    GetSingleCreatorUseCase,
} from '@src/app/creator/getSingleCreator/getSingleCreator.usecase';
import {
    UpdateCreatorRequestObject,
    UpdateCreatorUseCase,
} from '@src/app/creator/updateCreator/updateCreator.usecase';
import {
    DeleteCreatorRequestObject,
    DeleteCreatorUseCase,
} from '@src/app/creator/deleteCreator/deleteCreator.usecase';
import {
    CreatorEntity,
    CreateCreatorPayload,
    UpdateCreatorPayload,
    ListCreatorsPayload,
} from '@src/domain/creator';
import {
    ListCreatorsRequestObject,
    ListCreatorsUseCase,
} from '@src/app/creator/listCreators/listCreators.usecase';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Request } from 'express';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';

@ApiBearerAuth()
@ApiTags('creators')
@Controller('creators')
@UseGuards(AppAuthGuard)
export class CreatorController {
    constructor(
        private readonly createCreatorUseCase: CreateCreatorUseCase,
        private readonly deleteCreatorUseCase: DeleteCreatorUseCase,
        private readonly getSingleCreatorUseCase: GetSingleCreatorUseCase,
        private readonly listCreatorsUseCase: ListCreatorsUseCase,
        private readonly updateCreatorUseCase: UpdateCreatorUseCase,
    ) {}

    // TODO: add authentication back when auth service is completed
    @Get()
    async listCreators(
        @Query() filter: ListCreatorsPayload,
    ): Promise<ListResponseData<CreatorEntity>> {
        const reqObject = ListCreatorsRequestObject.builder(filter);
        const res = await this.listCreatorsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<CreatorEntity>>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Get(':id')
    async getCreatorById(@Param('id') id: string): Promise<CreatorEntity> {
        const reqObject = GetSingleCreatorRequestObject.builder(id);
        const res = await this.getSingleCreatorUseCase.execute(reqObject);

        return responseHandler<CreatorEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Post()
    async createCreator(
        @Req() req: Request,
        @Body() createCreatorPayload: CreateCreatorPayload,
    ): Promise<CreatorEntity> {
        const reqObject = CreateCreatorRequestObject.builder(
            createCreatorPayload,
            req.user as UserModel,
        );
        const res = await this.createCreatorUseCase.execute(reqObject);

        return responseHandler<CreatorEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Patch(':id')
    async updateCreator(
        @Body() updateCreatorPayload: UpdateCreatorPayload,
        @Param('id') id: string,
    ): Promise<any> {
        const reqObject = UpdateCreatorRequestObject.builder(
            id,
            updateCreatorPayload,
        );

        const res = await this.updateCreatorUseCase.execute(reqObject);

        return responseHandler<CreatorEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Delete(':id')
    async deleteCreator(@Param('id') id: string): Promise<void> {
        const reqObject = DeleteCreatorRequestObject.builder(id);
        const res = await this.deleteCreatorUseCase.execute(reqObject);

        return responseHandler(res);
    }
}
