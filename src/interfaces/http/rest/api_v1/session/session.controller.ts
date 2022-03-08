import {
    Controller,
    Body,
    Req,
    Post,
    Get,
    Query,
    Delete,
    Patch,
    Param,
    UseGuards,
} from '@nestjs/common';
import {
    CreateSessionRequestObject,
    CreateSessionUseCase,
} from '@src/app/session/createSession/createSession.usecase';
import {
    DeleteSessionRequestObject,
    DeleteSessionUseCase,
} from '@src/app/session/deleteSession/deleteSession.usecase';
import {
    ListSessionsRequestObject,
    ListSessionsUseCase,
} from '@src/app/session/listSessions/listSessions.usecase';
import {
    UpdateSessionRequestObject,
    UpdateSessionUseCase,
} from '@src/app/session/updateSession/updateSession.usecase';
import {
    UpdateConsumerSessionRequestObject,
    UpdateConsumerSessionUseCase,
} from '@src/app/session/updateConsumerSession/updateConsumerSession.usecase';
import {
    ListConsumerSessionsRequestObject,
    ListConsumerSessionsUseCase,
} from '@src/app/session/listConsumerSessions/listConsumerSessions.usecase';
import {
    SessionEntity,
    SessionConsumerEntity,
    SessionCreatePayload,
    SessionListPayload,
    UpdateSessionPayload,
    UpdateConsumerSessionPayload,
    ListConsumerSessionsPayload,
} from '@src/domain/session';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Request } from 'express';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole } from '@src/domain/user';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
@UseGuards(AppAuthGuard)
export class SessionController {
    constructor(
        private readonly createSessionUseCase: CreateSessionUseCase,
        private readonly updateSessionUseCase: UpdateSessionUseCase,
        private readonly updateConsumerSessionUseCase: UpdateConsumerSessionUseCase,
        private readonly listSessionsUseCase: ListSessionsUseCase,
        private readonly listConsumerSessionsUseCase: ListConsumerSessionsUseCase,
        private readonly deleteSessionUseCase: DeleteSessionUseCase,
    ) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator, UserRole.consumer)
    async listSessions(
        @Query() filter: SessionListPayload,
    ): Promise<ListResponseData<SessionEntity>> {
        const reqObject = ListSessionsRequestObject.builder(filter);
        const res = await this.listSessionsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<SessionEntity>>(res);
    }

    @Get('/consumerSessions')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator, UserRole.consumer)
    async listSessionConsumers(
        @Query() filter: ListConsumerSessionsPayload,
    ): Promise<ListResponseData<SessionConsumerEntity>> {
        const reqObject = ListConsumerSessionsRequestObject.builder(filter);
        const res = await this.listConsumerSessionsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<SessionConsumerEntity>>(res);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async createSession(
        @Body() createSessionPayload: SessionCreatePayload,
        @Req() req: Request,
    ): Promise<SessionEntity> {
        const user = req.user as UserModel;

        const reqObject = CreateSessionRequestObject.builder(
            createSessionPayload,
            user,
        );

        const res = await this.createSessionUseCase.execute(reqObject);

        return responseHandler<SessionEntity>(res);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async updateOrganization(
        @Body() updateSessionPayload: UpdateSessionPayload,
        @Param('id') id: string,
    ): Promise<SessionEntity> {
        const reqObject = UpdateSessionRequestObject.builder(
            id,
            updateSessionPayload,
        );

        const res = await this.updateSessionUseCase.execute(reqObject);

        return responseHandler<SessionEntity>(res);
    }

    @Patch('/consumerSessions/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator, UserRole.consumer)
    async updateSessionConsumer(
        @Body() updateConsumerSessionPayload: UpdateConsumerSessionPayload,
        @Param('id') id: string,
    ): Promise<SessionConsumerEntity> {
        const reqObject = UpdateConsumerSessionRequestObject.builder(
            id,
            updateConsumerSessionPayload,
        );

        const res = await this.updateConsumerSessionUseCase.execute(reqObject);

        return responseHandler<SessionConsumerEntity>(res);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async deleteSession(@Param('id') id: string): Promise<void> {
        const reqObject = DeleteSessionRequestObject.builder(id);
        const res = await this.deleteSessionUseCase.execute(reqObject);

        return responseHandler(res);
    }
}
