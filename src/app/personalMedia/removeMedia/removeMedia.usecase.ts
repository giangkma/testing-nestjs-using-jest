import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import StorageConfig from '@src/config/storage.config';
import { RemoveMediaPayload } from '@src/domain/personalMedia';
import { UserModel } from '@src/infra/database/model';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { StorageService } from '@src/infra/storage/storage.service';

export class RemoveMediaRequestObject extends ValidRequestObject {
    constructor(
        public readonly consumerId: string,
        public readonly removeMediaPayload: RemoveMediaPayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        consumerId: string,
        removeMediaPayload: RemoveMediaPayload,
        user: UserModel,
    ): RemoveMediaRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!removeMediaPayload) {
            invalidReq.addError('Media info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new RemoveMediaRequestObject(
            consumerId,
            removeMediaPayload,
            user,
        );
    }
}

@Injectable()
export class RemoveMediaUseCase extends UseCase<void> {
    constructor(
        @Inject(StorageConfig.KEY)
        private readonly storageConfig: ConfigType<typeof StorageConfig>,

        private personalMediaRepository: PersonalMediaRepository,
        private organizationRepository: OrganizationRepository,
        private storageService: StorageService,
    ) {
        super();
    }

    async processRequest(
        req_object: RemoveMediaRequestObject,
    ): Promise<void | ResponseFailure> {
        const { consumerId, removeMediaPayload, user } = req_object;

        // check if the personal media already exist in db
        const existPersonalMedias = await this.personalMediaRepository.findByConsumerId(
            consumerId,
        );

        if (!existPersonalMedias) {
            throw new Error('no data found');
        }

        // filter and delete images of individual personalMedia
        for (const personalMedia of existPersonalMedias) {
            const arrayIdToDelete: string[] = [];
            for (const media of personalMedia.medias) {
                for (const mediaIdToDelete of removeMediaPayload.mediaIds) {
                    if (mediaIdToDelete === media.id) {
                        arrayIdToDelete.push(mediaIdToDelete);
                    }
                }
            }

            if (!!arrayIdToDelete.length) {
                // remove media in list
                await this.personalMediaRepository.removeMedia(
                    personalMedia.id,
                    arrayIdToDelete,
                );
            }
        }

        const organizationName = await this.organizationRepository.getOrganizationName(
            user,
        );

        const containerName = `${organizationName}-${this.storageConfig.personalmedia_container}-${consumerId}`;

        await this.storageService.deleteImages(
            containerName,
            removeMediaPayload.mediaIds,
        );
    }
}
