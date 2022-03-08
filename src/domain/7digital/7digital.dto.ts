import { toISOStringWithoutMilisecond } from '@src/helpers/date.helper';
import { UserModel } from '@src/infra/database/model';
import { IPayload7DigitalSubcription } from '.';
import { get7DUserExpireDate } from '../consumer';

/**
 * get CreateSubcriptionPayload
 * @param {string} userId
 * @returns {IPayload7DigitalSubcription}
 */

export function getCreateSubcriptionPayload(
    userId: string,
): IPayload7DigitalSubcription {
    const now = new Date();

    return {
        country: 'NO',
        activatedAt: toISOStringWithoutMilisecond(now),
        currentPeriodStartDate: toISOStringWithoutMilisecond(now),
        expiryDate: toISOStringWithoutMilisecond(get7DUserExpireDate()), // 1 month
        userId,
    };
}

/**
 * get UpdateSubcriptionPayload
 * @param {UserModel} user
 * @returns {IPayload7DigitalSubcription}
 */

export function getUpdateSubcriptionPayload(
    user: UserModel,
    startTime: Date,
): IPayload7DigitalSubcription {
    return {
        country: 'NO',
        activatedAt: toISOStringWithoutMilisecond(user.createdDate),
        currentPeriodStartDate: toISOStringWithoutMilisecond(startTime),
        expiryDate: toISOStringWithoutMilisecond(
            get7DUserExpireDate(startTime),
        ),
        userId: user._id,
    };
}
