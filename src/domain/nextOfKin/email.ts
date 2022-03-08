import { UserModel } from '@src/infra/database/model';
import { CreateNextOfKinPayload } from '.';
import { ConsumerEntity } from '../consumer';

export interface InviteNextofkinPayload {
    consumer_firstname: string;
    consumer_lastname: string;
    sender_firstname: string; // either creator or org
    intitution_name: string;
    receiver_firstname: string;
    username?: string;
    password?: string;
}

export const getNextOfKinInviteEmailPayload = (
    receiver: CreateNextOfKinPayload,
    sender: UserModel, // Organization or Creator
    consumer: ConsumerEntity,
    organizationName: string,
    initialPassword: string,
): InviteNextofkinPayload => {
    return {
        receiver_firstname: receiver.profile.firstName,
        consumer_firstname: consumer.profile.firstName,
        consumer_lastname: consumer.profile.lastName,
        sender_firstname: sender.profile.firstName,
        intitution_name: organizationName,
        username: receiver.email,
        password: initialPassword,
    };
};
