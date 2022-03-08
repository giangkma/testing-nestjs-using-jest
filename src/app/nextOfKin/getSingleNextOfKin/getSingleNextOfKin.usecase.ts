import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';

import { Injectable } from '@nestjs/common';
import { Mapper } from '@nartc/automapper';
import { NextOfKinEntity } from '@src/domain/nextOfKin';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class GetSingleNextOfKinRequestObject extends ValidRequestObject {
    constructor(public nextOfKinId: string) {
        super();
    }

    static builder(
        nextOfKinId: string,
    ): GetSingleNextOfKinRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!nextOfKinId) {
            invalidReq.addError('next-of-kin id', 'missing');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new GetSingleNextOfKinRequestObject(nextOfKinId);
    }
}

@Injectable()
export class GetSingleNextOfKinUseCase extends UseCase<NextOfKinEntity> {
    constructor(private readonly nextOfKinRepository: NextOfKinRepository) {
        super();
    }

    async processRequest(
        req_object: GetSingleNextOfKinRequestObject,
    ): Promise<NextOfKinEntity | ResponseFailure> {
        const nextOfKin = await this.nextOfKinRepository.findById(
            req_object.nextOfKinId,
        );

        if (!nextOfKin) {
            throw new Error('invalid next-of-kin');
        }

        return nextOfKin;
    }
}
