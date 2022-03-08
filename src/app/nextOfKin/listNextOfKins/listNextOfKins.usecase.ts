import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { ListNextOfKinsPayload } from '@src/domain/nextOfKin';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { NextOfKinEntity } from '@src/domain/nextOfKin';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class ListNextOfKinsRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListNextOfKinsPayload) {
        super();
    }

    static builder(
        filter: ListNextOfKinsPayload,
    ): ListNextOfKinsRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListNextOfKinsRequestObject(filter);
    }
}

@Injectable()
export class ListNextOfKinsUseCase extends UseCase<
    ListResponseData<NextOfKinEntity>
> {
    constructor(private readonly nextOfKinRepository: NextOfKinRepository) {
        super();
    }

    async processRequest(
        req_object: ListNextOfKinsRequestObject,
    ): Promise<ListResponseData<NextOfKinEntity> | ResponseFailure> {
        const { filter } = req_object;

        // get list next-of-kins in db
        const [data, count] = await this.nextOfKinRepository.list(filter);

        // return next-of-kin entities
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
