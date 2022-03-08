import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
    GetSingleOrganizationRequestObject,
    GetSingleOrganizationUseCase,
} from '@src/app/organization/getSingleOrganization/getSingleOrganization.usecase';
import { BaseResponseData } from '@src/domain/helper/base.dto';
import { OrganizationEntity } from '@src/domain/organization';
import { userHasRole, UserRole } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';
import { AppAuthGuard } from '@src/interfaces/shared/guards/appAuth.guard';
import { responseHandler } from '@src/interfaces/shared/handler';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('organizationName')
@Controller('organizationName')
@UseGuards(AppAuthGuard)
export class organizationNameController {
    constructor(
        private readonly getSingleOrganizationUseCase: GetSingleOrganizationUseCase,
    ) {}

    // this endpoint will get the organizationName of current auth info of organization
    @Get('')
    async getOrganizationName(
        @Req() req: Request,
    ): Promise<BaseResponseData | OrganizationEntity> {
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
        return { data: organization.organizationName };
    }
}
