import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { MSALService } from '@src/infra/auth/msal.service';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { UserModel } from '@src/infra/database/model';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';

export class DeleteOrganizationRequestObject extends ValidRequestObject {
    constructor(public readonly id: string, public readonly user: UserModel) {
        super();
    }

    static builder(
        id: string,
        user: UserModel,
    ): DeleteOrganizationRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Organization id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteOrganizationRequestObject(id, user);
    }
}

@Injectable()
export class DeleteOrganizationUseCase extends UseCase<void> {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
        private readonly adminRepository: AdminRepository,
        private msalService: MSALService,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteOrganizationRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id, user } = req_object;

        const organization = await this.organizationRepository.findById(id);

        if (!organization) {
            throw new Error('Invalid organization id');
        }

        // delete Azure AD B2C user
        await this.msalService.deleteB2CUser(id);

        await this.organizationRepository.delete(id);

        await this.adminRepository.removeOrganization(user._id, id);

        return;
    }
}
