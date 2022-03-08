import {
    B2CUserInfo,
    CreateB2CUserPayload,
    MSALService,
} from '@src/infra/auth/msal.service';
import { UserRole, getUserNameType, getUserSignInType } from '@src/domain/user';

import { AuthService } from '@src/infra/auth/auth.service';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreateUserPayload } from './interfaces';
import { CreatorRepository } from '@src/infra/creator/creator.repository';
import { I7DigitalService } from '@src/infra/auth/7digital.service';
import { Injectable } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { getCreateConsumerPayload } from '@src/domain/consumer';
import { getCreateCreatorPayload } from '@src/domain/creator';
import { getCreateNextOfKinPayload } from '@src/domain/nextOfKin';
import { getCreateOrganizationPayload } from '@src/domain/organization';
import { addMonths } from 'date-fns';
import { getCreateSubcriptionPayload } from '@src/domain/7digital';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';
import { getCreateAdminPayload } from '@src/domain/admin';
@Injectable()
export class CreateUserService {
    constructor(
        private readonly msalService: MSALService,
        private i7DigitalService: I7DigitalService,
        private consumerRepository: ConsumerRepository,
        private creatorRepository: CreatorRepository,
        private organizationRepository: OrganizationRepository,
        private nextOfKinRepository: NextOfKinRepository,
        private adminRepository: AdminRepository,
        private authService: AuthService,
    ) {}
    /**
     *
     * Create user in database
     *
     * @param {CreateUserPayload} userCreatePayload
     * @returns {ConsumerEntity | CreatorEntity | OrganizationEntity | NextOfKinEntity}
     */
    async createUserInDB(userCreatePayload: CreateUserPayload): Promise<any> {
        let createUser;

        switch (userCreatePayload.role) {
            case UserRole.admin:
                const adminPayload = getCreateAdminPayload(userCreatePayload);
                createUser = this.adminRepository.createAndSave(adminPayload);
                break;
            case UserRole.consumer:
                const consumerPayload = getCreateConsumerPayload(
                    userCreatePayload,
                );
                createUser = this.consumerRepository.createAndSave(
                    consumerPayload,
                );
                break;
            case UserRole.creator:
                const creatorPayload = getCreateCreatorPayload(
                    userCreatePayload,
                );
                createUser = this.creatorRepository.createAndSave(
                    creatorPayload,
                );
                break;
            case UserRole.nextOfKin:
                const nextOfKinPayload = getCreateNextOfKinPayload(
                    userCreatePayload,
                );
                createUser = this.nextOfKinRepository.createAndSave(
                    nextOfKinPayload,
                );
                break;
            case UserRole.organization:
            default:
                const organizationPayload = getCreateOrganizationPayload(
                    userCreatePayload,
                );
                createUser = this.organizationRepository.createAndSave(
                    organizationPayload,
                );
                break;
        }

        return await createUser;
    }

    /**
     * Firstly, check user's password, if user does not send, auto generate random password.
     * Then create B2C user, 7Digital user and subscription
     * Finally, If all is successful, create user in db
     *
     * @param {CreateUserPayload} payload
     * @returns {string} B2C userId
     */
    async execute(userCreatePayload: CreateUserPayload): Promise<any> {
        // Use initial password that was sent by client or generate random password automatically.
        const initialPassword =
            userCreatePayload.initialPassword ||
            this.authService.generatePassword();

        const b2cUserInfo: CreateB2CUserPayload = {
            firstName: userCreatePayload.profile.firstName,
            lastName: userCreatePayload.profile.lastName,
            username:
                // If user is a creator, organization or next-of-kin, assign 'email' to username field
                // Otherwise the default will be 'username'
                userCreatePayload[getUserNameType(userCreatePayload.role)],
            signInType: getUserSignInType(userCreatePayload.role),
            forceChangePasswordNextSignIn: true,
            initialPassword,
        };

        // Do not force change password with consumers
        if (userCreatePayload.role === UserRole.consumer) {
            b2cUserInfo.forceChangePasswordNextSignIn = false;
        }
        // create b2c user
        const createB2CUserRes = await this.msalService.createB2CUser(
            b2cUserInfo,
        );
        const b2cUser = createB2CUserRes.data as B2CUserInfo;

        // assign id (Azure AD B2C user) to Samla's user
        userCreatePayload.id = b2cUser.id;

        // Do not create 7digital user or sub, as it does not need it in the current version
        //TODO: Add 7digital user and sub when next of kin can see video in next of kin interface
        if (userCreatePayload.role === UserRole.nextOfKin) {
            // create user in db
            const res = await this.createUserInDB(userCreatePayload);

            return {
                user: res,
                initialPassword,
            };
        }

        // create 7Digital user
        const { data } = await this.i7DigitalService.create7DigitalUser(
            b2cUser.id,
        );

        // Delete Azure AD B2C user if create 7Digital partner user failed.
        if (data.data.status === 'error') {
            // delete azure ad b2c user
            await this.msalService.deleteB2CUser(b2cUser.id);

            throw new Error(`7Digital: ${data.data.error.errorMessage}`);
        }

        // create 7Digital subcription
        const payloadCreateSubcription = getCreateSubcriptionPayload(
            b2cUser.id,
        );

        const create7DigitalSubcriptionRes = await this.i7DigitalService.create7DigitalSubcription(
            payloadCreateSubcription,
        );

        // Delete Azure AD B2C user if create 7Digital subcription failed.
        if (create7DigitalSubcriptionRes.data.data.error) {
            // delete azure ad b2c user
            await this.msalService.deleteB2CUser(b2cUser.id);
            throw new Error(
                `7Digital: ${create7DigitalSubcriptionRes.data.data.error.message}`,
            );
        }
        userCreatePayload.sevenDigitalExpiresAt = addMonths(new Date(), 1);

        // create user in db
        const res = await this.createUserInDB(userCreatePayload);

        return {
            user: res,
            initialPassword,
        };
    }
}
