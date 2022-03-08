import { UserModel } from '@src/infra/database/model';
import { CreateCreatorPayload } from '.';

export interface InviteCreatorPayload {
    receiver_firstname: string; // creator's firstname
    sender_firstname: string; // org user's firstname
    intitution_name: string;
    username?: string;
    password?: string;
}

export const getInviteCreatorEmailPayload = (
    receiver: CreateCreatorPayload,
    sender: UserModel, // Organization
    initialPassword: string,
): InviteCreatorPayload => {
    return {
        receiver_firstname: receiver.profile.firstName,
        sender_firstname: sender.profile.firstName,
        username: receiver.email,
        password: initialPassword,
        intitution_name: sender.organizationName,
    };
};
