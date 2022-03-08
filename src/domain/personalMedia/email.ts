import { ConsumerEntity } from '../consumer';
import { CreatorEntity } from '../creator';
import { NextOfKinEntity } from '../nextOfKin';
import { OrganizationEntity } from '../organization';

export interface NewImagesNotificationPayload {
    receiver_firstname: string; //creator or org user's firstname
    nextofkin_firstname: string;
    nextofkin_lastname: string;
    consumer_firstname: string;
}

export const getNewImagesNotificationEmailPayload = (
    receiver: OrganizationEntity | CreatorEntity,
    nextOfKin: NextOfKinEntity,
    consumer: ConsumerEntity,
): NewImagesNotificationPayload => {
    return {
        receiver_firstname: receiver.profile.firstName,
        nextofkin_firstname: nextOfKin.profile.firstName,
        nextofkin_lastname: nextOfKin.profile.lastName,
        consumer_firstname: consumer.profile.firstName,
    };
};
