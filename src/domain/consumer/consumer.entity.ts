import {
    ArrayUnique,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { IUser, UserProfile, UserRole } from '../user';

import { AutoMap } from '@nartc/automapper';
import { Type } from 'class-transformer';
import { addMonths } from 'date-fns';

export class SurveyForm {
    @AutoMap()
    @IsOptional()
    @IsString()
    childhoodInfo?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    schoolInfo?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    youthInfo?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    adultInfo?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    presentInfo?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    otherInfo?: string;
}

export class ConsumerProfile extends UserProfile {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    lastName: string;
}

export class ConsumerFollowers {
    @AutoMap()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    creatorIds: string[];

    @AutoMap()
    @IsOptional()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    nextOfKinIds?: string[];
}

/**
 * Consumer base object
 *
 * @export
 * @class ConsumerBase
 */
export class ConsumerBase implements IUser {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    username: string;

    @AutoMap()
    @IsNotEmpty()
    @IsString()
    organizationId: string;

    @AutoMap(() => ConsumerProfile)
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => ConsumerProfile)
    profile: ConsumerProfile;

    @AutoMap(() => SurveyForm)
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => SurveyForm)
    surveyForm?: SurveyForm;

    @AutoMap(() => ConsumerFollowers)
    @IsOptional()
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => ConsumerFollowers)
    followers?: ConsumerFollowers;

    @AutoMap()
    @IsEnum(UserRole)
    role: UserRole = UserRole.consumer;

    @AutoMap()
    @IsDate()
    createdDate: Date = new Date();

    @AutoMap()
    @IsOptional()
    @IsDate()
    updatedDate?: Date;

    @AutoMap()
    @IsOptional()
    @IsDate()
    sevenDigitalExpiresAt?: Date;
}

/**
 * Consumer domain entity
 *
 * @export
 * @class ConsumerEntity
 * @extends {ConsumerBase}
 */
export class ConsumerEntity extends ConsumerBase {
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    id: string;
}

// -------------- Business logic ----------------- //
/**
 *
 * Get 7Digital user expire date
 *
 * @returns {Date}
 */
export function get7DUserExpireDate(startDate?: Date): Date {
    if (startDate) {
        return addMonths(new Date(startDate), 1);
    }
    return addMonths(new Date(), 1); //1 month
}
