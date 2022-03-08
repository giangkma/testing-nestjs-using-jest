import { CreatorEntity, ListCreatorsPayload } from '@src/domain/creator';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { Mapper } from '@nartc/automapper';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class ListCreatorsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListCreatorsPayload) {
        super();
    }

    static builder(
        filter: ListCreatorsPayload,
    ): ListCreatorsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListCreatorsRequestObject(filter);
    }
}

@Injectable()
export class ListCreatorsUseCase extends UseCase<
    ListResponseData<CreatorEntity>
> {
    constructor(private readonly creatorRepository: CreatorRepository) {
        super();
    }

    async processRequest(
        req_object: ListCreatorsRequestObject,
    ): Promise<ListResponseData<CreatorEntity> | ResponseFailure> {
        const { filter } = req_object;

        // return creator entities
        const [data, count] = await this.creatorRepository.list(filter);

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
