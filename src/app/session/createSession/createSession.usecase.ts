import { Mapper } from '@nartc/automapper';
import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import {
    CreateSessionInfo,
    getNewVideoNotificationEmailPayload,
    SessionCreatePayload,
    SessionEntity,
} from '@src/domain/session';
import { UserEntity } from '@src/domain/user';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { UserModel } from '@src/infra/database/model';
import { EmailService, EmailTemplateIds } from '@src/infra/email/email.service';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { SessionRepository } from '@src/infra/session/session.repository';

export class CreateSessionRequestObject extends ValidRequestObject {
    constructor(
        public readonly info: SessionCreatePayload,
        public readonly user: UserModel,
    ) {
        super();
    }

    static builder(
        info: SessionCreatePayload,
        user: UserModel,
    ): CreateSessionRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!user) {
            invalidReq.addError('User', 'invalid');
        }

        if (!info) {
            invalidReq.addError('Consumer info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateSessionRequestObject(info, user);
    }
}

@Injectable()
export class CreateSessionUseCase extends UseCase<SessionEntity> {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly consumerRepository: ConsumerRepository,
        private readonly organizationRepository: OrganizationRepository,
        private readonly nextOfKinRepository: NextOfKinRepository,
        private readonly emailService: EmailService,
    ) {
        super();
    }

    /**
     * Create session consumer entity for each consumer of created session
     *
     * @param {string} sessionId
     * @param {string[]} consumerIds
     * @memberof CreateSessionUseCase
     */
    async createSessionConsumer(
        sessionId: string,
        consumerIds: string[],
    ): Promise<void> {
        await Promise.all(
            consumerIds.map(id => {
                return this.sessionRepository.createSessionConsumer({
                    sessionId,
                    consumerId: id,
                });
            }),
        );
    }

    async processRequest(
        req_object: CreateSessionRequestObject,
    ): Promise<SessionEntity | ResponseFailure> {
        const { user, info } = req_object;

        // map user orm to user entity
        const userEntity = Mapper.map(user, UserEntity);

        // create session in db
        const newSessionInfo: CreateSessionInfo = {
            ...info,
            author: userEntity.id,
        };

        const sessionEntity = await this.sessionRepository.createAndSave(
            newSessionInfo,
        );

        await this.createSessionConsumer(sessionEntity.id, info.consumerIds);

        for (const consumerId of info.consumerIds) {
            const consumer = await this.consumerRepository.findById(consumerId);
            if (
                consumer.followers &&
                consumer.followers.nextOfKinIds &&
                consumer.followers.nextOfKinIds.length
            ) {
                for (const nextOfKinId of consumer.followers.nextOfKinIds) {
                    const organizationName = await this.organizationRepository.getOrganizationName(
                        user,
                    );
                    const nextOfKin = await this.nextOfKinRepository.findById(
                        nextOfKinId,
                    );
                    //Send New video Notification Email
                    const emailData = getNewVideoNotificationEmailPayload(
                        nextOfKin,
                        consumer,
                        organizationName,
                    );

                    await this.emailService.sendEmail(
                        nextOfKin.email,
                        EmailTemplateIds.newVideoNotification,
                        emailData,
                    );
                }
            }
        }

        // return session entity
        return sessionEntity;
    }
}
