import { Controller, Get, Req, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    GetSingleOrganizationRequestObject,
    GetSingleOrganizationUseCase,
} from '@src/app/organization/getSingleOrganization/getSingleOrganization.usecase';
import { responseHandler } from '@src/interfaces/shared/handler';
import { LicenceEntity, OrganizationEntity } from '@src/domain/organization';
import { UserModel } from '@src/infra/database/model';
import { Request } from 'express';
import { Roles } from '@src/interfaces/shared/roles.decorator';
import { UserRole, userHasRole } from '@src/domain/user';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { RolesGuard } from '@src/interfaces/shared/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('licence')
@Controller('licence')
@UseGuards(AppAuthGuard)
export class LicenceController {
    constructor(
        private readonly getSingleOrganizationUseCase: GetSingleOrganizationUseCase,
        private readonly consumerRepository: ConsumerRepository,
    ) {}

    // this endpoint will get the licence of current auth info of organization / creator
    @Get('info')
    @UseGuards(RolesGuard)
    @Roles(UserRole.creator, UserRole.organization)
    async getLicenceInfo(
        @Req() req: Request,
    ): Promise<LicenceEntity | OrganizationEntity> {
        const user = req.user as UserModel;
        let organizationId;

        if (userHasRole(user, [UserRole.creator])) {
            // use user's organizationId as an id if auth info is creator
            organizationId = user.organizationId;
        } else {
            // use user's _id as an id if auth info is creator
            organizationId = user._id;
        }

        const reqObject = GetSingleOrganizationRequestObject.builder(
            organizationId,
        );
        const res = await this.getSingleOrganizationUseCase.execute(reqObject);

        if (!res.isValid()) {
            return responseHandler<OrganizationEntity>(res);
        }

        const organization = res.value as OrganizationEntity;

        const nConsumersInOrganization = await this.consumerRepository.countConsumersInOrganization(
            organizationId,
        );

        return {
            total: organization.licence,
            active: nConsumersInOrganization,
        };
    }

    // This endpoint checks all organization's licences and it will be restricted by admin
    // TODO:Add 'Admin' role guard to this endpoint when it's available
    // @Get('organization/:id')
    // async getLicence(
    //     @Param('id') id: string,
    // ): Promise<number | OrganizationEntity> {
    //     const reqObject = GetSingleOrganizationRequestObject.builder(id);
    //     const res = await this.getSingleOrganizationUseCase.execute(reqObject);

    //     if (!res.isValid()) {
    //         return responseHandler<OrganizationEntity>(res);
    //     }

    //     const organization = res.value as OrganizationEntity;
    //     return organization.licence;
    // }
}
