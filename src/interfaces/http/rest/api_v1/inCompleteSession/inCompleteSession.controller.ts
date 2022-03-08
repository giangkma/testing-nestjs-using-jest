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
import { Request } from 'express';
import { responseHandler } from '@src/interfaces/shared/handler';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
    InCompleteSessionEntity,
    CreateInCompleteSessionPayload,
    ListInCompleteSessionsPayload,
    UpdateInCompleteSessionPayload,
} from '@src/domain/inCompleteSession';
import {
    CreateInCompleteSessionRequestObject,
    CreateInCompleteSessionUseCase,
} from '@src/app/inCompleteSession/createInCompleteSession/createInCompleteSession.usecase';
import { UserModel } from '@src/infra/database/model';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole } from '@src/domain/user';
import {
    GetSingleInCompleteSessionRequestObject,
    GetSingleInCompleteSessionUseCase,
} from '@src/app/inCompleteSession/getSingleInCompleteSession/getSingleInCompleteSession.usecase';
import {
    DeleteInCompleteSessionRequestObject,
    DeleteInCompleteSessionUseCase,
} from '@src/app/inCompleteSession/deleteInCompleteSession/deleteInCompleteSession.usecase';
import { ListResponseData } from '@src/domain/helper/base.dto';
import {
    ListInCompleteSessionsRequestObject,
    ListInCompleteSessionsUseCase,
} from '@src/app/inCompleteSession/listInCompleteSession/listInCompleteSessions.usecase';
import {
    UpdateInCompleteSessionRequestObject,
    UpdateInCompleteSessionUseCase,
} from '@src/app/inCompleteSession/updateInCompleteSession/updateInCompleteSession.usecase';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('inCompleteSessions')
@Controller('inCompleteSessions')
@UseGuards(AppAuthGuard)
export class InCompleteSessionController {
    constructor(
        private readonly listInCompleteSessionsUseCase: ListInCompleteSessionsUseCase,
        private readonly createInCompleteSessionUseCase: CreateInCompleteSessionUseCase,
        private readonly getSingleInCompleteSessionUseCase: GetSingleInCompleteSessionUseCase,
        private readonly deleteInCompleteSessionUseCase: DeleteInCompleteSessionUseCase,
        private readonly updateInCompleteSessionUseCase: UpdateInCompleteSessionUseCase,
    ) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async listInCompleteSessions(
        @Query() filter: ListInCompleteSessionsPayload,
    ): Promise<ListResponseData<InCompleteSessionEntity>> {
        const reqObject = ListInCompleteSessionsRequestObject.builder(filter);
        const res = await this.listInCompleteSessionsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<InCompleteSessionEntity>>(res);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async createInCompleteSession(
        @Req() req: Request,
        @Body() createInCompleteSessionPayload: CreateInCompleteSessionPayload,
    ): Promise<InCompleteSessionEntity> {
        const reqObject = CreateInCompleteSessionRequestObject.builder(
            createInCompleteSessionPayload,
            req.user as UserModel,
        );
        const res = await this.createInCompleteSessionUseCase.execute(
            reqObject,
        );

        return responseHandler<InCompleteSessionEntity>(res);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async getInCompleteSessionById(
        @Param('id') id: string,
    ): Promise<InCompleteSessionEntity | null> {
        const reqObject = GetSingleInCompleteSessionRequestObject.builder(id);
        const res = await this.getSingleInCompleteSessionUseCase.execute(
            reqObject,
        );

        return responseHandler<InCompleteSessionEntity>(res);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async deleteInCompleteSession(
        @Req() req: Request,
        @Param('id') id: string,
    ): Promise<void> {
        const reqObject = DeleteInCompleteSessionRequestObject.builder(
            id,
            req.user as UserModel,
        );
        const res = await this.deleteInCompleteSessionUseCase.execute(
            reqObject,
        );

        return responseHandler(res);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async updateInCompleteSession(
        @Param('id') id: string,
        @Body()
        updateInCompleteSessionPayload: UpdateInCompleteSessionPayload,
    ): Promise<InCompleteSessionEntity> {
        const reqObject = UpdateInCompleteSessionRequestObject.builder(
            id,
            updateInCompleteSessionPayload,
        );

        const res = await this.updateInCompleteSessionUseCase.execute(
            reqObject,
        );

        return responseHandler<InCompleteSessionEntity>(res);
    }
}
