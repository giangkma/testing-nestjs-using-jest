import {
    Controller,
    Get,
    Param,
    Post,
    Patch,
    Body,
    Query,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    GetSingleConsumerRequestObject,
    GetSingleConsumerUseCase,
} from '@src/app/consumer/getSingleConsumer/getSingleConsumer.usecase';
import {
    ListConsumersRequestObject,
    ListConsumersUseCase,
} from '@src/app/consumer/listConsumers/listConsumers.usecase';
import {
    DeleteConsumerRequestObject,
    DeleteConsumerUseCase,
} from '@src/app/consumer/deleteConsumer/deleteConsumer.usecase';
import {
    ConsumerEntity,
    CreateConsumerPayload,
    ListConsumersPayload,
    UpdateConsumerPayload,
    ConsumerDetailedFilterPayload,
} from '@src/domain/consumer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { responseHandler } from '@src/interfaces/shared/handler';
import {
    CreateConsumerRequestObject,
    CreateConsumerUseCase,
} from '@src/app/consumer/createConsumer/createConsumer.usecase';
import {
    UpdateConsumerRequestObject,
    UpdateConsumerUseCase,
} from '@src/app/consumer/updateConsumer/updateConsumer.usecase';
import { CreatorEntity } from '@src/domain/creator';

import { plainToClass } from 'class-transformer';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';
import { Request } from 'express';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

const testCreator = plainToClass(CreatorEntity, {
    id: '5ee34ece4f21081bb9661811', // test creator id,
    email: 'testCreator@test.com',
});

@ApiBearerAuth()
@ApiTags('consumers')
@Controller('consumers')
@UseGuards(AppAuthGuard)
export class ConsumerController {
    constructor(
        private readonly getSingleConsumerUseCase: GetSingleConsumerUseCase,
        private readonly createConsumerUseCase: CreateConsumerUseCase,
        private readonly listConsumersUseCase: ListConsumersUseCase,
        private readonly updateConsumerUseCase: UpdateConsumerUseCase,
        private readonly deleteConsumerUseCase: DeleteConsumerUseCase,
    ) {}

    @Get()
    async listConsumers(
        @Query() filter: ListConsumersPayload,
    ): Promise<ListResponseData<ConsumerEntity>> {
        const reqObject = ListConsumersRequestObject.builder(filter);
        const res = await this.listConsumersUseCase.execute(reqObject);

        return responseHandler<ListResponseData<ConsumerEntity>>(res);
    }

    @Get(':id')
    async getConsumerById(
        @Param('id') id: string,
        @Query() filter: ConsumerDetailedFilterPayload,
    ): Promise<ConsumerEntity | Partial<ConsumerEntity>> {
        const reqObject = GetSingleConsumerRequestObject.builder(id, filter);
        const res = await this.getSingleConsumerUseCase.execute(reqObject);

        return responseHandler<ConsumerEntity | Partial<ConsumerEntity>>(res);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async createConsumer(
        @Body() createConsumerPayload: CreateConsumerPayload,
        @Req() req: Request,
    ): Promise<any> {
        const user = req.user as UserModel;

        const reqObject = CreateConsumerRequestObject.builder(
            createConsumerPayload,
            user,
        );
        const res = await this.createConsumerUseCase.execute(reqObject);

        return responseHandler<ConsumerEntity>(res);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async updateConsumer(
        @Body() updateConsumerPayload: UpdateConsumerPayload,
        @Param('id') id: string,
    ): Promise<any> {
        const reqObject = UpdateConsumerRequestObject.builder(
            id,
            updateConsumerPayload,
        );

        const res = await this.updateConsumerUseCase.execute(reqObject);

        return responseHandler<ConsumerEntity>(res);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.organization, UserRole.creator)
    async deleteConsumer(@Param('id') id: string): Promise<void> {
        const reqObject = DeleteConsumerRequestObject.builder(
            id,
            // req.consumer as ConsumerEntity,
            testCreator,
        );
        const res = await this.deleteConsumerUseCase.execute(reqObject);

        return responseHandler(res);
    }
}
