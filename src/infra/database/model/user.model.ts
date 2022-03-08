import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { AutoMap } from '@nartc/automapper';
import { UserRole } from '@src/domain/user';

export class UserFollowers {
    @AutoMap()
    @Column()
    creatorIds?: string[];

    @AutoMap()
    @Column()
    consumerIds?: string[];

    @AutoMap()
    @Column()
    nextOfKinIds?: string[];
}

export class SurveyFormModel {
    @AutoMap()
    @Column()
    childhoodInfo?: string;

    @AutoMap()
    @Column()
    schoolInfo?: string;

    @AutoMap()
    @Column()
    youthInfo?: string;

    @AutoMap()
    @Column()
    adultInfo?: string;

    @AutoMap()
    @Column()
    presentInfo?: string;

    @AutoMap()
    @Column()
    otherInfo?: string;
}

export class UserProfile {
    @AutoMap()
    @Column()
    firstName?: string;

    @AutoMap()
    @Column()
    lastName?: string;

    @AutoMap()
    @Column()
    name?: string;

    @AutoMap()
    @Column()
    avatar?: string;

    @AutoMap()
    @Column()
    jobTitle?: string;

    @AutoMap()
    @Column()
    phoneNumber?: string;
}

@Entity()
export class User {
    @AutoMap()
    @ObjectIdColumn()
    _id: string;

    @AutoMap()
    @Index({ unique: true, sparse: true })
    @Column()
    username?: string;

    @AutoMap()
    @Index({ unique: true, sparse: true })
    @Column()
    email?: string;

    @AutoMap()
    @Index({ unique: true, sparse: true })
    @Column()
    organizationName?: string;

    @AutoMap()
    @Index()
    @Column()
    organizationId?: string;

    @AutoMap()
    @Index()
    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @AutoMap()
    @Column()
    department?: string;

    @AutoMap()
    @Column()
    licence?: number; // limits the number of Consumer accounts the organization can have

    @AutoMap(() => UserProfile)
    @Column(type => UserProfile)
    profile?: UserProfile;

    @AutoMap(() => SurveyFormModel)
    @Column(type => SurveyFormModel)
    surveyForm?: SurveyFormModel;

    @AutoMap(() => UserFollowers)
    @Column(type => UserFollowers)
    followers?: UserFollowers;

    @AutoMap()
    @Index()
    @Column()
    createdDate: Date = new Date();

    @AutoMap()
    @Column()
    updatedDate?: Date;

    @AutoMap()
    @Column()
    sevenDigitalExpiresAt?: Date;

    @AutoMap()
    @Column()
    consent?: boolean;
}
