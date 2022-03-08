import {
    SessionConsumerEntity,
    SessionConsumerStatus,
    SessionEntity,
    SessionMedia,
} from './session.entity';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';

export interface CreateSessionInfo {
    author: string; // creatorId or organizationId
    title: string;
    notes?: string;
    thumbnail?: string;
    media: SessionMedia;
    createdDate?: Date;
}

export interface SessionFilterInfo extends BaseListFilterInfo {
    author?: string;
    title?: string;
    sessionIds?: string[];
}

export interface ConsumerSessionFilterInfo extends BaseListFilterInfo {
    statuses?: SessionConsumerStatus[];
    consumerIds?: string[];
    sessionIds?: string[];
}

export interface CreateSessionConsumerInfo {
    sessionId: string;
    consumerId: string;
}

export interface UpdateSessionInfo {
    title?: string;
    notes?: string;
    thumbnail?: string;
    media?: SessionMedia;
}

export interface UpdateConsumerSessionInfo {
    status?: SessionConsumerStatus;
    playbackCount?: number;
    feedback?: string;
    longestPlayTime?: number;
}

/**
 * Session repository interface for dependency inversion
 *
 * @export
 * @interface ISessionRepository
 */
export interface ISessionRepository {
    list(filter: SessionFilterInfo): Promise<[SessionEntity[], number]>;
    listConsumerSessions(
        filter: ConsumerSessionFilterInfo,
    ): Promise<[SessionConsumerEntity[], number]>;
    createAndSave: (sessionInfo: CreateSessionInfo) => Promise<SessionEntity>;
    createSessionConsumer: (
        info: CreateSessionConsumerInfo,
    ) => Promise<SessionConsumerEntity>;
    updateSession: (
        id: string,
        updateSessionInfo: UpdateSessionInfo,
        currentSession: SessionEntity,
    ) => Promise<void>;
    updateConsumerSession(
        id: string,
        updateConsumerSessionInfo: UpdateConsumerSessionInfo,
    ): Promise<void>;
    findByAuthor: (author: string) => Promise<SessionEntity[]>;
    findById: (id: string) => Promise<SessionEntity | null>;
    findConsumerSessionById: (
        id: string,
    ) => Promise<SessionConsumerEntity | null>;
    deleteSession: (id: string) => Promise<void>;
    deleteSessionConsumerBySessionId: (id: string) => Promise<void>;
}
