import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { AutoMap } from '@nartc/automapper';
import { ObjectID } from 'mongodb'; // importing object id from mongodb instead of typeorm due to typeorm's problem https://github.com/typeorm/typeorm/issues/2238#issuecomment-394629083
import { SessionConsumerStatus } from '@src/domain/session';
import { ContainerType } from '@src/domain/storage';

export class SessionImage {
    @AutoMap()
    @Column()
    id: string;

    @AutoMap()
    @Column({ type: 'enum', enum: ContainerType })
    containerType: ContainerType;
}

export class SessionAudio {
    @AutoMap()
    @Column()
    trackId: string; // 7digital track id

    @AutoMap()
    @Column()
    releaseId: number; // 7digital release id
}

export class SessionMedia {
    @AutoMap(() => SessionImage)
    @Column(type => SessionImage)
    images?: SessionImage[]; // array of images that stored on azure storage

    @AutoMap()
    @Column()
    imageDuration?: number; // image duration in second, only need if images are uploaded

    @AutoMap(() => SessionAudio)
    @Column(type => SessionAudio)
    audios?: SessionAudio[];

    @AutoMap()
    @Column()
    video?: string; // video url
}

@Entity()
export class Session {
    @AutoMap()
    @ObjectIdColumn()
    readonly id: ObjectID;

    @AutoMap()
    @Index()
    @Column()
    author: string; // creatorId or organizationId

    @AutoMap()
    @Column()
    title: string;

    @AutoMap()
    @Column()
    notes?: string;

    @AutoMap()
    @Column()
    thumbnail: string; // thumbnail url

    @AutoMap(() => SessionMedia)
    @Column(type => SessionMedia)
    media: SessionMedia;

    @AutoMap()
    @Index()
    @Column()
    createdDate: Date;

    @AutoMap()
    @Column()
    updatedDate?: Date;
}

@Entity()
export class SessionConsumer {
    @AutoMap()
    @ObjectIdColumn()
    readonly id: ObjectID;

    @AutoMap()
    @Index()
    @Column()
    sessionId: ObjectID;

    @AutoMap()
    @Index()
    @Column()
    consumerId: string;

    @AutoMap()
    @Index()
    @Column({ type: 'enum', enum: SessionConsumerStatus })
    status: SessionConsumerStatus;

    @AutoMap()
    @Column()
    playbackCount? = 0;

    @AutoMap()
    @Column()
    feedback?: string;

    /** Longest play time in second */
    @AutoMap()
    @Column()
    longestPlayTime? = 0;

    @AutoMap()
    @Index()
    @Column()
    createdDate: Date;

    @AutoMap()
    @Column()
    updatedDate?: Date;
}
