import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { CreatorEntity } from '@src/domain/creator';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { Injectable } from '@nestjs/common';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class GetSingleCreatorRequestObject extends ValidRequestObject {
    constructor(public id: string) {
        super();
    }

    static builder(
        id: string,
    ): GetSingleCreatorRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!id) {
            invalidReq.addError('creator id', 'missing');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new GetSingleCreatorRequestObject(id);
    }
}

@Injectable()
export class GetSingleCreatorUseCase extends UseCase<CreatorEntity> {
    constructor(private creatorsRepository: CreatorRepository) {
        super();
    }

    async processRequest(
        req_object: GetSingleCreatorRequestObject,
    ): Promise<CreatorEntity | ResponseFailure> {
        // get creator from db
        return await this.creatorsRepository.findById(req_object.id);
    }
}
