import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { AdminRepository } from '@src/infra/admin/admin.repository';
import { MSALService } from '@src/infra/auth/msal.service';

export class DeleteAdminRequestObject extends ValidRequestObject {
    constructor(public readonly id: string) {
        super();
    }

    static builder(
        id: string,
    ): DeleteAdminRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('Admin id', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new DeleteAdminRequestObject(id);
    }
}

@Injectable()
export class DeleteAdminUseCase extends UseCase<void> {
    constructor(
        private readonly adminRepository: AdminRepository,
        private msalService: MSALService,
    ) {
        super();
    }

    async processRequest(
        req_object: DeleteAdminRequestObject,
    ): Promise<void | ResponseFailure> {
        const { id } = req_object;

        const admin = await this.adminRepository.findById(id);

        if (!admin) {
            throw new Error('Invalid admin id');
        }

        // delete Azure AD B2C user
        await this.msalService.deleteB2CUser(id);

        await this.adminRepository.delete(id);

        return;
    }
}
