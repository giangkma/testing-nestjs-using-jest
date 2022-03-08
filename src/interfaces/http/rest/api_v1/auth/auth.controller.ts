import { Mapper } from '@nartc/automapper';
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContainerType, SASInfo } from '@src/domain/storage';
import { getUserEntityClass } from '@src/domain/shared/userEntity.class';
import { CheckEmailExistsParams, UserRole } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';
import { StorageService } from '@src/infra/storage/storage.service';
import { UserRepository } from '@src/infra/user/user.repository';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { Request } from 'express';
import { I7DigitalService } from '@src/infra/auth/7digital.service';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
@UseGuards(AppAuthGuard)
export class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly storageService: StorageService,
        private readonly i7DigitalService: I7DigitalService,
    ) {}

    @Get('getUser')
    async getUser(@Req() req: Request): Promise<any> {
        const user = req.user as UserModel;
        const userEntityClass = getUserEntityClass(user);

        if (user.role !== UserRole.nextOfKin) {
            await this.i7DigitalService.checkAndUpdate7DigitalSubcription(user);
        }

        return Mapper.map(req.user, userEntityClass);
    }

    @Get('checkEmailExists/:email')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async checkEmailExists(
        @Param() params: CheckEmailExistsParams,
    ): Promise<boolean> {
        const user = await this.userRepository.findByEmail(params.email);
        return !!user;
    }

    @Get('personalMediaSAS')
    async getPersonalMediaSAS(
        @Query('consumerId') consumerId: string,
        @Req() req: Request,
    ): Promise<SASInfo> {
        const user = req.user as UserModel;
        const result = await this.storageService.generateSas(
            user,
            ContainerType.personalMedia,
            consumerId,
        );
        return result;
    }

    @Get('commonMediaSAS')
    async getCommonMediaSAS(@Req() req: Request): Promise<SASInfo> {
        const user = req.user as UserModel;
        const result = await this.storageService.generateSas(
            user,
            ContainerType.commonMedia,
        );
        return result;
    }

    @Get('avatarSAS')
    async getAvatarSAS(@Req() req: Request): Promise<SASInfo> {
        const user = req.user as UserModel;
        const result = await this.storageService.generateSas(
            user,
            ContainerType.avatars,
        );
        return result;
    }
}
