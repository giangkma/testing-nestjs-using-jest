import * as _ from 'lodash';

import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    PersonalMediaEntity,
    UpdateMediaPayload,
} from '@src/domain/personalMedia';

import { Injectable } from '@nestjs/common';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';

export class UpdateMediaRequestObject extends ValidRequestObject {
    constructor(
        public readonly id: string,
        public readonly updateMediaPayload: UpdateMediaPayload,
    ) {
        super();
    }

    static builder(
        id: string,
        updateMediaPayload: UpdateMediaPayload,
    ): UpdateMediaRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!updateMediaPayload) {
            invalidReq.addError('Personal media info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UpdateMediaRequestObject(
            id,
            updateMediaPayload,
        );
    }
}

@Injectable()
export class UpdateMediaUseCase extends UseCase<
    PersonalMediaEntity
> {
    constructor(private personalMediaRepository: PersonalMediaRepository) {
        super();
    }

    async processRequest(
        req_object: UpdateMediaRequestObject,
    ): Promise<PersonalMediaEntity | ResponseFailure> {
        const { id, updateMediaPayload } = req_object;

        // check if the personal media already exist in db
        const existPersonalMedia = await this.personalMediaRepository.findById(
            id,
        );

        if (!existPersonalMedia) {
            throw new Error('invalid personal media id');
        }

        // ensure to keep the order of the original media array
        const updatedMedias = existPersonalMedia.medias.map((m) => {
            const updateItem = updateMediaPayload.medias.find((u) => u.id === m.id);
          
            return { ...m, ...updateItem } ?? m 
        });
        
        await this.personalMediaRepository.updateMedia(
            id,
            updatedMedias,
        );

        // return personal media updated
        return await this.personalMediaRepository.findById(id);
    }
}
