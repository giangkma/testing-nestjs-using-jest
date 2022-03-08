import { Column, Entity, ObjectIdColumn } from 'typeorm';

import { AutoMap } from '@nartc/automapper';
import { ObjectID } from 'mongodb';

export class LogItem {
    @AutoMap()
    @ObjectIdColumn()
    id: ObjectID;

    @AutoMap()
    @Column()
    payload: Record<string, unknown>;

    @AutoMap()
    @Column()
    targetEndpoint: string;

    @AutoMap()
    @Column()
    time: string;

    @AutoMap()
    @Column()
    error?: Record<string, unknown>;
}

@Entity({ name: 'logs' })
export class Log {
    @AutoMap()
    @ObjectIdColumn()
    id: ObjectID;

    @AutoMap()
    @Column()
    userId: string;

    @AutoMap()
    @Column()
    count: number;

    @AutoMap(() => LogItem)
    @Column(type => LogItem)
    items: LogItem[];

    @AutoMap()
    @Column()
    startTime: Date;

    @AutoMap()
    @Column()
    endTime: Date;
}
