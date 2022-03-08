import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import {
    getNewImagesNotificationEmailPayload,
    PersonalMediaEntity,
    UploadMediasPayload,
} from '@src/domain/personalMedia';

import { Injectable } from '@nestjs/common';
import { PersonalMediaRepository } from '@src/infra/personalMedia/personalMedia.repository';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { EmailService, EmailTemplateIds } from '@src/infra/email/email.service';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';

export class UploadMediasRequestObject extends ValidRequestObject {
    constructor(public readonly uploadMediasPayload: UploadMediasPayload) {
        super();
    }

    static builder(
        uploadMediasPayload: UploadMediasPayload,
    ): UploadMediasRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!uploadMediasPayload) {
            invalidReq.addError('Personal media info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new UploadMediasRequestObject(uploadMediasPayload);
    }
}

@Injectable()
export class UploadMediasUseCase extends UseCase<PersonalMediaEntity> {
    constructor(
        private personalMediaRepository: PersonalMediaRepository,
        private nextOfKinRepository: NextOfKinRepository,
        private creatorRepository: CreatorRepository,
        private consumerRepository: ConsumerRepository,
        private organizationRepository: OrganizationRepository,
        private readonly emailService: EmailService,
    ) {
        super();
    }

    async processRequest(
        req_object: UploadMediasRequestObject,
    ): Promise<PersonalMediaEntity | ResponseFailure> {
        const { uploadMediasPayload } = req_object;

        // check if the personal media already exist in db
        const existPersonalMedia = await this.personalMediaRepository.findByConsumerIdAndUploaderId(
            uploadMediasPayload.consumerId,
            uploadMediasPayload.uploaderId,
        );

        if (existPersonalMedia) {
            // upload new medias
            await this.personalMediaRepository.uploadMedias(
                existPersonalMedia.id,
                uploadMediasPayload,
            );

            // get personal media info updated
            return await this.personalMediaRepository.findById(
                existPersonalMedia.id,
            );
        }

        const nextOfKin = await this.nextOfKinRepository.findById(
            uploadMediasPayload.uploaderId,
        );

        const consumer = await this.consumerRepository.findById(
            uploadMediasPayload.consumerId,
        );

        const organization = await this.organizationRepository.findById(
            nextOfKin.organizationId,
        );

        //Send NewImagesNotification mail to Organization
        const emailDataSentToOrg = getNewImagesNotificationEmailPayload(
            organization,
            nextOfKin,
            consumer,
        );

        await this.emailService.sendEmail(
            organization.email,
            EmailTemplateIds.newImagesNotification,
            emailDataSentToOrg,
        );

        if (
            nextOfKin.followers.creatorIds &&
            nextOfKin.followers.creatorIds.length
        ) {
            for (const creatorId of nextOfKin.followers.creatorIds) {
                const creator = await this.creatorRepository.findById(
                    creatorId,
                );

                //Send NewImagesNotification mail to Creator
                const emailDataSentToCreator = getNewImagesNotificationEmailPayload(
                    creator,
                    nextOfKin,
                    consumer,
                );

                await this.emailService.sendEmail(
                    creator.email,
                    EmailTemplateIds.newImagesNotification,
                    emailDataSentToCreator,
                );
            }
        }

        // return personal media entity
        return await this.personalMediaRepository.createAndSave(
            uploadMediasPayload,
        );
    }
}
