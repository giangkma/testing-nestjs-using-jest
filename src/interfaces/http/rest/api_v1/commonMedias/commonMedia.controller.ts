import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Media } from '@src/domain/personalMedia';
import { UserRole } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';
import { StorageService } from '@src/infra/storage/storage.service';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('commonMedias')
@Controller('commonMedias')
@UseGuards(AppAuthGuard)
export class CommonMediaController {
    constructor(private readonly storageService: StorageService) {}

    @Get('')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization, UserRole.consumer)
    async getCommonmedia(@Req() req: Request): Promise<Media[]> {
        const user = req.user as UserModel;
        const result = await this.storageService.getCommonmedia(user);
        return result;
    }
}
