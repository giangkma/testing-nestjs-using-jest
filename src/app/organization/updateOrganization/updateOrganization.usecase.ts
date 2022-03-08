import * as _ from 'lodash';

import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    OrganizationEntity,
    UpdateOrganizationPayload,
} from '@src/domain/organization';

import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateOrganizationRequestObject extends ValidRequestObject {
    constructor(
        public id: string, // organization id
        public readonly updateOrganizationPayload: UpdateOrganizationPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateOrganizationPayload: UpdateOrganizationPayload,
    ): UpdateOrganizationRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();
        if (_.isEmpty(updateOrganizationPayload)) {
            invalidReq.addError('Organization info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateOrganizationRequestObject(
            id,
            updateOrganizationPayload,
        );
    }
}

@Injectable()
export class UpdateOrganizationUseCase extends UseCase<OrganizationEntity> {
    constructor(private organizationRepository: OrganizationRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateOrganizationRequestObject,
    ): Promise<OrganizationEntity | ResponseFailure> {
        const { id, updateOrganizationPayload } = req_object;

        // check if organization exist in db
        const currentOrganization = await this.organizationRepository.findById(
            id,
        );

        if (!currentOrganization) {
            throw new Error('Organization does not exist');
        }

        // update organization in db
        await this.organizationRepository.update(id, updateOrganizationPayload);

        // get organization info updated
        return await this.organizationRepository.findById(id);
    }
}
