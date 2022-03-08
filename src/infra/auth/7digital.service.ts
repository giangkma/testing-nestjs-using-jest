import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import AppConfig from '@src/config/configuration';
import {
    getUpdateSubcriptionPayload,
    I7DigitalSubcription,
    IPayload7DigitalSubcription,
} from '@src/domain/7digital';
import { AxiosResponse } from 'axios';
import { addDays } from 'date-fns';
import { map } from 'rxjs/operators';
import { UserModel } from '../database/model';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class I7DigitalService {
    constructor(
        @Inject(AppConfig.KEY)
        private readonly appConfig: ConfigType<typeof AppConfig>,
        private httpService: HttpService,
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Create 7Digital partner user
     *
     * @param {string} userId
     * @memberof I7DigitalService
     */
    async create7DigitalUser(userId: string): Promise<any> {
        return await this.httpService
            .get(
                `${this.appConfig.app_proxy}/7digital?target=user/create?country=NO%26userid=${userId}`,
            )
            .pipe(map(this.serializeHttpResponse))
            .toPromise();
    }

    /**
     * Check and update 7digital streaming subscription
     *
     * @param {UserModel} user
     * @returns {(Promise<void>)}
     * @memberof I7DigitalService
     */
    async checkAndUpdate7DigitalSubcription(user: UserModel): Promise<any> {
        const now = new Date();

        // subscription has expired
        if (user.sevenDigitalExpiresAt.getTime() < now.getTime()) {
            const updateData: IPayload7DigitalSubcription = getUpdateSubcriptionPayload(
                user,
                now,
            );

            await this.create7DigitalSubcription(updateData);

            await this.userRepository.updateSevenDigitalExpiresAt(
                user._id,
                updateData.expiryDate,
            );
            return;
        }

        // subscription will expire the next day
        if (user.sevenDigitalExpiresAt.getTime() < addDays(now, 1).getTime()) {
            const updateData: IPayload7DigitalSubcription = getUpdateSubcriptionPayload(
                user,
                user.sevenDigitalExpiresAt,
            );

            await this.create7DigitalSubcription(updateData);

            await this.userRepository.updateSevenDigitalExpiresAt(
                user._id,
                updateData.expiryDate,
            );
            return;
        }
    }

    async create7DigitalSubcription(
        payload: IPayload7DigitalSubcription,
    ): Promise<any> {
        const data: I7DigitalSubcription = {
            currency: 'NOK',
            planCode: 'premium-unlimited-streaming',
            recurringFee: 0,
            status: 'active',
            ...payload,
        };

        return await this.httpService
            .post(
                `${this.appConfig.app_proxy}/7digital?target=user/unlimitedStreaming`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .pipe(map(this.serializeHttpResponse))
            .toPromise();
    }

    private serializeHttpResponse(res: AxiosResponse) {
        return {
            headers: res.headers,
            data: res.data,
        };
    }
}
