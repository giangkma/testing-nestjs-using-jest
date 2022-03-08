import { ConsumerEntity } from '../consumer';
import { NextOfKinEntity } from '../nextOfKin';

export interface NewVideoNotificationPayload {
    receiver_firstname: string; // Nextofkin firstname
    consumer_firstname: string;
    intitution_name: string;
}

export const getNewVideoNotificationEmailPayload = (
    receiver: NextOfKinEntity,
    consumer: ConsumerEntity,
    organizationName: string,
): NewVideoNotificationPayload => {
    return {
        receiver_firstname: receiver.profile.firstName,
        consumer_firstname: consumer.profile.firstName,
        intitution_name: organizationName,
    };
};
