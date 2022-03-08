import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    CreateAdminRequestObject,
    CreateAdminUseCase,
} from '@src/app/admin/createAdmin/createAdmin.usecase';
import {
    DeleteAdminRequestObject,
    DeleteAdminUseCase,
} from '@src/app/admin/deleteAdmin/deleteAdmin.usecase';
import { AdminEntity, CreateAdminPayload } from '@src/domain/admin';
import { UserRole } from '@src/domain/user';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Roles } from '@src/interfaces/shared/roles.decorator';

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
@UseGuards(AppAuthGuard)
export class AdminController {
    constructor(
        private readonly createAdminUseCase: CreateAdminUseCase,
        private readonly deleteAdminUseCase: DeleteAdminUseCase,
    ) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async createAdmin(
        @Body() createAdminPayload: CreateAdminPayload,
    ): Promise<any> {
        const reqObject = CreateAdminRequestObject.builder(createAdminPayload);
        const res = await this.createAdminUseCase.execute(reqObject);

        return responseHandler<AdminEntity>(res);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    async deleteAdmin(@Param('id') id: string): Promise<void> {
        const reqObject = DeleteAdminRequestObject.builder(id);
        const res = await this.deleteAdminUseCase.execute(reqObject);

        return responseHandler(res);
    }
}
