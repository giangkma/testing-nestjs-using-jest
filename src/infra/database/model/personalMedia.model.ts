import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { AutoMap } from '@nartc/automapper';
import { ObjectId } from 'mongodb';

export class Media {
    @AutoMap()
    @Column({ unique: true })
    id: string;

    @AutoMap()
    @Column()
    description?: string;

    @AutoMap()
    @Column()
    type?: string;

    @AutoMap()
    @Column()
    name?: string;

    @AutoMap()
    @Column()
    metaData?: Record<string, unknown>;
}

@Entity()
export class PersonalMedia {
    @AutoMap()
    @ObjectIdColumn()
    id: ObjectId;

    @AutoMap()
    @Column()
    consumerId: string;

    @AutoMap()
    @Column()
    uploaderId: string;

    @AutoMap(() => Media)
    @Column(type => Media)
    medias: Media[];

    @AutoMap()
    @Index()
    @Column()
    createdDate: Date = new Date();

    @AutoMap()
    @Index()
    @Column()
    updatedDate?: Date;
}
