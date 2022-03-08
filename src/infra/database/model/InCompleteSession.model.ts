import { AutoMap } from '@nartc/automapper';
import { ContainerType } from '@src/domain/storage';
import { ObjectID } from 'mongodb'; // importing object id from mongodb instead of typeorm due to typeorm's problem https://github.com/typeorm/typeorm/issues/2238#issuecomment-394629083
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

export class ImageSelection {
    @AutoMap()
    @Column()
    id: string;

    @AutoMap()
    @Column({ type: 'enum', enum: ContainerType })
    containerType: ContainerType;

    @AutoMap()
    @Column()
    description?: string;
}

export class TrackSelection {
    @AutoMap()
    @Column()
    id: number;

    @AutoMap()
    @Column()
    releaseId: number;

    @AutoMap()
    @Column()
    artist: string; // name of artist

    @AutoMap()
    @Column()
    title: string;

    @AutoMap()
    @Column()
    duration: number; // audio duration in second

    @AutoMap()
    @Column()
    cover: string; // image/avatar url of this audio
}

export class RecipientProfile {
    @AutoMap()
    @Column()
    firstName: string;

    @AutoMap()
    @Column()
    lastName: string;

    @AutoMap()
    @Column()
    avatar?: string;
}

export class Recipient {
    @AutoMap()
    @Column()
    id: string;

    @AutoMap(() => RecipientProfile)
    @Column(type => RecipientProfile)
    profile: RecipientProfile;
}

export class SessionForm {
    @AutoMap()
    @Column()
    name: string;

    @AutoMap(() => ImageSelection)
    @Column(type => ImageSelection)
    images: ImageSelection[];

    @AutoMap(() => TrackSelection)
    @Column(type => TrackSelection)
    trackSelection: TrackSelection[];

    @AutoMap()
    @Column()
    title: string;

    @AutoMap()
    @Column()
    notes?: string;

    @AutoMap(() => Recipient)
    @Column(type => Recipient)
    recipient: Recipient;

    @AutoMap()
    @Column()
    totalDuration: number;

    @AutoMap()
    @Column()
    step: number;
}

@Entity()
export class InCompleteSession {
    @AutoMap()
    @ObjectIdColumn()
    readonly id: ObjectID;

    @AutoMap()
    @Index()
    @Column()
    author: string; // creator id or organization id

    @AutoMap(() => SessionForm)
    @Column(type => SessionForm)
    sessionForm: SessionForm;

    @AutoMap()
    @Index()
    @Column()
    createdDate: Date;

    @AutoMap()
    @Column()
    updatedDate?: Date;
}
