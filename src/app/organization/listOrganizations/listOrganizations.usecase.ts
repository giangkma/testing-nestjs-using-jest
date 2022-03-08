import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    ListOrganizationsPayload,
    OrganizationEntity,
} from '@src/domain/organization';

import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class ListOrganizationsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListOrganizationsPayload) {
        super();
    }

    static builder(
        filter: ListOrganizationsPayload,
    ): ListOrganizationsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListOrganizationsRequestObject(filter);
    }
}

@Injectable()
export class ListOrganizationsUseCase extends UseCase<
    ListResponseData<OrganizationEntity>
> {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: ListOrganizationsRequestObject,
    ): Promise<ListResponseData<OrganizationEntity> | ResponseFailure> {
        const { filter } = req_object;

        // return organization entities
        const [data, count] = await this.organizationRepository.list(filter);

        return {
            data,
            info: {
                total: count,
                pageSize: filter.limit,
                pageIndex: filter.pageIndex,
            },
        };
    }
}
