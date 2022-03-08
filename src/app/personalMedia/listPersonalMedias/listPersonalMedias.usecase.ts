import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    ListPersonalMediasPayload,
    PersonalMediaEntity,
} from '@src/domain/personalMedia';

import { Injectable } from '@nestjs/common';
import { ListResponseData } from '@src/domain/helper/base.dto';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class ListPersonalMediasRequestObject extends ValidRequestObject {
    constructor(public readonly filter: ListPersonalMediasPayload) {
        super();
    }

    static builder(
        filter: ListPersonalMediasPayload,
    ): ListPersonalMediasRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!filter) {
            invalidReq.addError('Filter', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new ListPersonalMediasRequestObject(filter);
    }
}

@Injectable()
export class ListPersonMediasUseCase extends UseCase<
    ListResponseData<PersonalMediaEntity>
> {
    constructor(
        private readonly personalMediaRepository: PersonalMediaRepository,
    ) {
        super();
    }

    async processRequest(
        req_object: ListPersonalMediasRequestObject,
    ): Promise<ListResponseData<PersonalMediaEntity> | ResponseFailure> {
        const { filter } = req_object;

        // return personal media entities
        const [data, count] = await this.personalMediaRepository.list(filter);

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
