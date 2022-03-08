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
    CreateOrganizationRequestObject,
    CreateOrganizationUseCase,
} from '@src/app/organization/createOrganization/createOrganization.usecase';
import {
    GetSingleOrganizationRequestObject,
    GetSingleOrganizationUseCase,
} from '@src/app/organization/getSingleOrganization/getSingleOrganization.usecase';
import {
    UpdateOrganizationRequestObject,
    UpdateOrganizationUseCase,
} from '@src/app/organization/updateOrganization/updateOrganization.usecase';
import {
    DeleteOrganizationRequestObject,
    DeleteOrganizationUseCase,
} from '@src/app/organization/deleteOrganization/deleteOrganization.usecase';
import {
    OrganizationEntity,
    CreateOrganizationPayload,
    UpdateOrganizationPayload,
    ListOrganizationsPayload,
} from '@src/domain/organization';
import {
    ListOrganizationsRequestObject,
    ListOrganizationsUseCase,
} from '@src/app/organization/listOrganizations/listOrganizations.usecase';
import {
    AssignCreatorsRequestObject,
    AssignCreatorsUseCase,
} from '@src/app/organization/assignCreators/assignCreators.usecase';
import {
    RemoveCreatorsRequestObject,
    RemoveCreatorsUseCase,
} from '@src/app/organization/removeCreators/removeCreators.usecase';
import {
    AssignConsumersRequestObject,
    AssignConsumersUseCase,
} from '@src/app/organization/assignConsumers/assignConsumers.usecase';
import {
    RemoveConsumersRequestObject,
    RemoveConsumersUseCase,
} from '@src/app/organization/removeConsumers/removeConsumers.usecase';
import { responseHandler } from '@src/interfaces/shared/handler';
import { ListResponseData } from '@src/domain/helper/base.dto';
import {
    ConsumerEntity,
    UpdateConsumerFollowersPayload,
} from '@src/domain/consumer';
import {
    CreatorEntity,
    UpdateCreatorFollowersPayload,
} from '@src/domain/creator';
import { ApiParam } from '@nestjs/swagger';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole } from '@src/domain/user';
import { Request } from 'express';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('organizations')
@Controller('organizations')
@UseGuards(AppAuthGuard)
export class OrganizationController {
    constructor(
        private readonly createOrganizationUseCase: CreateOrganizationUseCase,
        private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
        private readonly getSingleOrganizationUseCase: GetSingleOrganizationUseCase,
        private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
        private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
        private readonly assignCreatorsUseCase: AssignCreatorsUseCase,
        private readonly assignConsumersUseCase: AssignConsumersUseCase,
        private readonly removeCreatorsUseCase: RemoveCreatorsUseCase,
        private readonly removeConsumersUseCase: RemoveConsumersUseCase,
    ) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async listOrganizations(
        @Query() filter: ListOrganizationsPayload,
    ): Promise<ListResponseData<OrganizationEntity>> {
        const reqObject = ListOrganizationsRequestObject.builder(filter);
        const res = await this.listOrganizationsUseCase.execute(reqObject);

        return responseHandler<ListResponseData<OrganizationEntity>>(res);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async getOrganizationById(
        @Param('id') id: string,
    ): Promise<OrganizationEntity> {
        const reqObject = GetSingleOrganizationRequestObject.builder(id);
        const res = await this.getSingleOrganizationUseCase.execute(reqObject);

        return responseHandler<OrganizationEntity>(res);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async createOrganization(
        @Body() createOrganizationPayload: CreateOrganizationPayload,
        @Req() req: Request,
    ): Promise<OrganizationEntity> {
        const user = req.user as UserModel;
        const reqObject = CreateOrganizationRequestObject.builder(
            createOrganizationPayload,
            user,
        );
        const res = await this.createOrganizationUseCase.execute(reqObject);

        return responseHandler<OrganizationEntity>(res);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async updateOrganization(
        @Body() updateOrganizationPayload: UpdateOrganizationPayload,
        @Param('id') id: string,
    ): Promise<OrganizationEntity> {
        const reqObject = UpdateOrganizationRequestObject.builder(
            id,
            updateOrganizationPayload,
        );

        const res = await this.updateOrganizationUseCase.execute(reqObject);

        return responseHandler<OrganizationEntity>(res);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async deleteOrganization(
        @Param('id') id: string,
        @Req() req: Request,
    ): Promise<void> {
        const user = req.user as UserModel;
        const reqObject = DeleteOrganizationRequestObject.builder(id, user);
        const res = await this.deleteOrganizationUseCase.execute(reqObject);

        return responseHandler(res);
    }

    @Patch('/assignCreators/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    @ApiParam({
        name: 'id',
        description: 'consumer id',
    })
    async assignCreators(
        @Param('id') id: string,
        @Body() updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ): Promise<ConsumerEntity> {
        const reqObject = AssignCreatorsRequestObject.builder(
            id,
            updateConsumerFollowersPayload,
        );

        const res = await this.assignCreatorsUseCase.execute(reqObject);

        return responseHandler<ConsumerEntity>(res);
    }

    @Patch('/assignConsumers/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    @ApiParam({
        name: 'id',
        description: 'creator id',
    })
    async assignConsumers(
        @Param('id') id: string,
        @Body() updateCreatorFollowersPayload: UpdateCreatorFollowersPayload,
    ): Promise<CreatorEntity> {
        const reqObject = AssignConsumersRequestObject.builder(
            id,
            updateCreatorFollowersPayload,
        );

        const res = await this.assignConsumersUseCase.execute(reqObject);

        return responseHandler<CreatorEntity>(res);
    }

    @Delete('/removeCreators/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    @ApiParam({
        name: 'id',
        description: 'consumer id',
    })
    async removeCreators(
        @Param('id') id: string,
        @Body() updateConsumerFollowersPayload: UpdateConsumerFollowersPayload,
    ): Promise<ConsumerEntity> {
        const reqObject = RemoveCreatorsRequestObject.builder(
            id,
            updateConsumerFollowersPayload,
        );

        const res = await this.removeCreatorsUseCase.execute(reqObject);

        return responseHandler<ConsumerEntity>(res);
    }

    @Delete('/removeConsumers/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    @ApiParam({
        name: 'id',
        description: 'creator id',
    })
    async removeConsumers(
        @Param('id') id: string,
        @Body() updateCreatorFollowersPayload: UpdateCreatorFollowersPayload,
    ): Promise<CreatorEntity> {
        const reqObject = RemoveConsumersRequestObject.builder(
            id,
            updateCreatorFollowersPayload,
        );

        const res = await this.removeConsumersUseCase.execute(reqObject);

        return responseHandler<CreatorEntity>(res);
    }
}
