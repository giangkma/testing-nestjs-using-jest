import * as _ from 'lodash';

import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    MongoEntityManager,
    MongoRepository,
    ObjectLiteral,
    getMongoManager,
    getMongoRepository,
} from 'typeorm';
import {
    ConsumerSessionFilterInfo,
    CreateSessionConsumerInfo,
    CreateSessionInfo,
    ISessionRepository,
    SessionConsumerEntity,
    SessionConsumerStatus,
    SessionEntity,
    SessionFilterInfo,
    UpdateConsumerSessionInfo,
    UpdateSessionInfo,
} from '@src/domain/session';
import {
    SessionConsumerModel,
    SessionImageModel,
    SessionAudioModel,
    SessionMediaModel,
    SessionModel,
} from '@src/infra/database/model';

import { Mapper } from '@nartc/automapper';
import { ObjectID } from 'mongodb'; // importing object id from mongodb instead of typeorm due to typeorm's problem https://github.com/typeorm/typeorm/issues/2238#issuecomment-394629083

@EntityRepository(SessionModel)
export class SessionRepository extends AbstractRepository<SessionModel>
    implements ISessionRepository {
    private readonly mRepository: MongoRepository<SessionModel>;
    private readonly mManager: MongoEntityManager;

    constructor() {
        super();
        this.mRepository = getMongoRepository(SessionModel);
        this.mManager = getMongoManager();
    }

    /**
     * list sessions
     *
     * @param {SessionFilterInfo} filter
     * @returns {(Promise<[SessionEntity[], number]>)}
     * @memberof SessionRepository
     */
    async list(filter: SessionFilterInfo): Promise<[SessionEntity[], number]> {
        const query: FindConditions<SessionModel> | ObjectLiteral = {};
        if (filter.author) {
            query.author = filter.author;
        }

        if (filter.title) {
            query.title = filter.title;
        }

        if (filter.sessionIds) {
            query['_id'] = {
                $in: filter.sessionIds.map(id =>
                    ObjectID.createFromHexString(id),
                ),
            };
        }

        const [sessions, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [sessions.map(s => Mapper.map(s, SessionEntity)), count];
    }

    /**
     * list consumer session
     *
     * @param {SessionConsumerFilterInfo} filter
     * @returns {(Promise<[SessionConsumerEntity[], number]>)}
     * @memberof SessionRepository
     */
    async listConsumerSessions(
        filter: ConsumerSessionFilterInfo,
    ): Promise<[SessionConsumerEntity[], number]> {
        const query: FindConditions<SessionConsumerModel> | ObjectLiteral = {};

        if (filter.consumerIds) {
            query.consumerId = {
                $in: filter.consumerIds,
            };
        }

        if (filter.statuses) {
            query.status = {
                $in: filter.statuses,
            };
        }

        if (filter.sessionIds) {
            query.sessionId = {
                $in: filter.sessionIds.map(id =>
                    ObjectID.createFromHexString(id),
                ),
            };
        }

        const [sessions, count] = await this.mManager.findAndCount(
            SessionConsumerModel,
            {
                where: query,
                skip: (filter.pageIndex - 1) * filter.limit,
                take: filter.limit,
            },
        );

        return [sessions.map(s => Mapper.map(s, SessionConsumerEntity)), count];
    }

    /**
     * Create and save session
     *
     * @param {CreateSessionInfo} sessionInfo
     * @returns {(Promise<SessionEntity | null>)}
     * @memberof SessionRepository
     */
    async createAndSave(
        sessionInfo: CreateSessionInfo,
    ): Promise<SessionEntity> {
        // set session data
        const newSession = new SessionModel();

        newSession.author = sessionInfo.author;
        // map media instance
        newSession.media = Mapper.map(sessionInfo.media, SessionMediaModel);

        newSession.createdDate = sessionInfo.createdDate;
        newSession.title = sessionInfo.title;

        if (sessionInfo.notes) {
            newSession.notes = sessionInfo.notes;
        }

        if (sessionInfo.thumbnail) {
            newSession.thumbnail = sessionInfo.thumbnail;
        }

        // create session in db
        const createdSession = await this.manager.save(newSession);

        // convert to entity class
        return Mapper.map(createdSession, SessionEntity);
    }

    async createSessionConsumer(
        info: CreateSessionConsumerInfo,
    ): Promise<SessionConsumerEntity> {
        const newSessionConsumer = new SessionConsumerModel();
        // convert string to objectId
        newSessionConsumer.sessionId = ObjectID.createFromHexString(
            info.sessionId,
        );

        newSessionConsumer.consumerId = info.consumerId;

        newSessionConsumer.status = SessionConsumerStatus.active;
        newSessionConsumer.createdDate = new Date();

        const createdSessionConsumer = await this.manager.save(
            newSessionConsumer,
        );

        return Mapper.map(createdSessionConsumer, SessionConsumerEntity);
    }

    /**
     *
     * @param {string} id
     * @param {UpdateSessionInfo} updateSessionInfo
     * @param {SessionEntity} currentSession
     * @memberof SessionRepository
     */
    async updateSession(
        id: string,
        updateSessionInfo: UpdateSessionInfo,
        currentSession: SessionEntity,
    ): Promise<void> {
        const updateSessionData: Partial<SessionModel> = _.omit(
            updateSessionInfo,
            ['userId', 'media', 'createdDate'],
        );

        if (updateSessionInfo.media) {
            // If media exists then combine & media instance
            const surveyForm = currentSession.media
                ? _.merge(currentSession.media, updateSessionInfo.media)
                : updateSessionInfo.media;

            updateSessionData.media = Mapper.map(surveyForm, SessionMediaModel);
        }

        updateSessionData.updatedDate = new Date();

        await this.manager.update<SessionModel>(
            SessionModel,
            id,
            updateSessionData,
        );
    }

    /**
     * Update session consumer by id
     *
     * @param {string} id consumer session id
     * @returns {Promise<void>}
     * @memberof SessionRepository
     */
    async updateConsumerSession(
        id: string,
        updateConsumerSessionInfo: UpdateConsumerSessionInfo,
    ): Promise<void> {
        const updateSessionConsumerData: Partial<SessionConsumerModel> = _.omit(
            updateConsumerSessionInfo,
            ['sessionId', 'consumerId', 'createdDate'],
        );

        // set updated date
        updateSessionConsumerData.updatedDate = new Date();

        await this.manager.update<SessionConsumerModel>(
            SessionConsumerModel,
            id,
            updateSessionConsumerData,
        );
    }

    /**
     * Find session by author
     *
     * @param {string} id
     * @returns {Promise<SessionEntity>}
     * @memberof SessionRepository
     */
    async findByAuthor(author: string): Promise<SessionEntity[]> {
        // find document with matched author (user id)
        const res = await this.repository.find({
            where: {
                author,
            },
        });

        return res.map(s => Mapper.map(s, SessionEntity));
    }

    /**
     * Find session by id
     *
     * @param {string} id
     * @returns {Promise<SessionEntity>}
     * @memberof SessionRepository
     */
    async findById(id: string): Promise<SessionEntity | null> {
        // get session model instance by id
        const session = await this.repository.findOne(id);

        // return converted instance
        return session ? Mapper.map(session, SessionEntity) : null;
    }

    /**
     * Find consumer session by id
     *
     * @param {string} id
     * @returns {Promise<SessionConsumerEntity | null>}
     * @memberof SessionRepository
     */
    async findConsumerSessionById(
        id: string,
    ): Promise<SessionConsumerEntity | null> {
        // get session consumer model instance by id
        const sessionConsumer = await this.manager.findOne<
            SessionConsumerModel
        >(SessionConsumerModel, id);

        // return converted instance
        return sessionConsumer
            ? Mapper.map(sessionConsumer, SessionConsumerEntity)
            : null;
    }

    /**
     * Delete session by id
     *
     * @param {string} id
     * @returns {Promise<void>}
     * @memberof SessionRepository
     */
    async deleteSession(id: string): Promise<void> {
        await this.mRepository.delete(id);
    }

    /**
     * Delete consumer session by id
     *
     * @param {string} sessionId session id
     * @param {string[]} consumerSessionIds
     * @returns {Promise<void>}
     * @memberof SessionRepository
     */
    async deleteSessionConsumerBySessionId(id: string): Promise<void> {
        await this.mManager.deleteMany<SessionConsumerModel>(
            SessionConsumerModel,
            {
                sessionId: new ObjectID(id),
            },
        );
    }
}
