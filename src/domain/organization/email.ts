import { CreateOrganizationPayload } from '.';

export interface InviteOrganizationPayload {
    username: string;
    password: string;
}

export const getInviteOrganizationEmailPayload = (
    receiver: CreateOrganizationPayload,
    initialPassword: string,
): InviteOrganizationPayload => {
    return {
        username: receiver.email,
        password: initialPassword,
    };
};
