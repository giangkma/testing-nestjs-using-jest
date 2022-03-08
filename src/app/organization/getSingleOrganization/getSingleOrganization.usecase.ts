import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from '@src/domain/organization';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class GetSingleOrganizationRequestObject extends ValidRequestObject {
    constructor(public id: string) {
        super();
    }

    static builder(
        id: string,
    ): GetSingleOrganizationRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('organization id', 'missing');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new GetSingleOrganizationRequestObject(id);
    }
}

@Injectable()
export class GetSingleOrganizationUseCase extends UseCase<OrganizationEntity> {
    constructor(private organizationRepository: OrganizationRepository) {
        super();
    }

    async processRequest(
        req_object: GetSingleOrganizationRequestObject,
    ): Promise<OrganizationEntity | ResponseFailure> {
        // get organization from db
        return await this.organizationRepository.findById(req_object.id);
    }
}
