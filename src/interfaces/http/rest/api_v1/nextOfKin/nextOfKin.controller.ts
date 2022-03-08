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
    CreateNextOfKinRequestObject,
    CreateNextOfKinUseCase,
} from '@src/app/nextOfKin/createNextOfKin/createNextOfKin.usecase';
import {
    DeleteNextOfKinRequestObject,
    DeleteNextOfKinUseCase,
} from '@src/app/nextOfKin/deleteNextOfKin/deleteNextOfKin.usecase';
import {
    GetSingleNextOfKinRequestObject,
    GetSingleNextOfKinUseCase,
} from '@src/app/nextOfKin/getSingleNextOfKin/getSingleNextOfKin.usecase';
import {
    ListNextOfKinsRequestObject,
    ListNextOfKinsUseCase,
} from '@src/app/nextOfKin/listNextOfKins/listNextOfKins.usecase';
import {
    UpdateNextOfKinRequestObject,
    UpdateNextOfKinUseCase,
} from '@src/app/nextOfKin/updateNextOfKin/updateNextOfKin.usecase';
import { ListResponseData } from '@src/domain/helper/base.dto';
import {
    CreateNextOfKinPayload,
    ListNextOfKinsPayload,
    NextOfKinEntity,
    UpdateNextOfKinPayload,
} from '@src/domain/nextOfKin';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Request } from 'express';
@ApiBearerAuth()
@ApiTags('nextOfKins')
@Controller('nextOfKins')
@UseGuards(AppAuthGuard)
export class NextOfKinController {
    constructor(
        private readonly createNextOfKinUseCase: CreateNextOfKinUseCase,
        private readonly deleteNextOfKinUseCase: DeleteNextOfKinUseCase,
        private readonly getSingleNextOfKinUseCase: GetSingleNextOfKinUseCase,
        private readonly listNextOfKinsUseCase: ListNextOfKinsUseCase,
        private readonly updateNextOfKinUseCase: UpdateNextOfKinUseCase,
    ) {}

    // TODO: add authentication back when auth service is completed
    @Post()
    async createNextOfKin(
        @Req() req: Request,
        @Body() createNextOfKinPayload: CreateNextOfKinPayload,
    ): Promise<NextOfKinEntity> {
        const reqObject = CreateNextOfKinRequestObject.builder(
            createNextOfKinPayload,
            req.user as UserModel,
        );
        const res = await this.createNextOfKinUseCase.execute(reqObject);

        return responseHandler<NextOfKinEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Patch(':id')
    async updateNextOfKin(
        @Body() updateConsumerPayload: UpdateNextOfKinPayload,
        @Param('id') id: string,
    ): Promise<NextOfKinEntity> {
        const reqObject = UpdateNextOfKinRequestObject.builder(
            id,
            updateConsumerPayload,
        );

        const res = await this.updateNextOfKinUseCase.execute(reqObject);

        return responseHandler<NextOfKinEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Get()
    async listNextOfKins(
        @Query() filter: ListNextOfKinsPayload,
    ): Promise<ListResponseData<NextOfKinEntity>> {
        const reqObject = ListNextOfKinsRequestObject.builder(filter);
        const res = await this.listNextOfKinsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<NextOfKinEntity>>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Get(':id')
    async getNextOfKinById(@Param('id') id: string): Promise<NextOfKinEntity> {
        const reqObject = GetSingleNextOfKinRequestObject.builder(id);
        const res = await this.getSingleNextOfKinUseCase.execute(reqObject);

        return responseHandler<NextOfKinEntity>(res);
    }

    // TODO: add authentication back when auth service is completed
    @Delete(':id')
    async deleteNextOfKin(@Param('id') id: string): Promise<void> {
        const reqObject = DeleteNextOfKinRequestObject.builder(id);
        const res = await this.deleteNextOfKinUseCase.execute(reqObject);

        return responseHandler(res);
    }
}
