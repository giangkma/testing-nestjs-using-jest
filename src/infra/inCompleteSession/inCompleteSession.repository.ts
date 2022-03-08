import { Mapper } from '@nartc/automapper';
import {
    CreateInCompleteSessionInfo,
    IInCompleteSessionRepository,
    InCompleteSessionEntity,
    InCompleteSessionsFilterInfo,
    UpdateInCompleteSessionInfo,
} from '@src/domain/inCompleteSession';
import { InCompleteSessionModel } from '@src/infra/database/model';
import * as _ from 'lodash';
import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    getMongoManager,
    getMongoRepository,
    MongoEntityManager,
    MongoRepository,
    ObjectLiteral,
} from 'typeorm';

@EntityRepository(InCompleteSessionModel)
export class InCompleteSessionRepository
    extends AbstractRepository<InCompleteSessionModel>
    implements IInCompleteSessionRepository {
    private readonly mRepository: MongoRepository<InCompleteSessionModel>;
    private readonly mManager: MongoEntityManager;

    constructor() {
        super();
        this.mRepository = getMongoRepository(InCompleteSessionModel);
        this.mManager = getMongoManager();
    }

    /**
     * Create and save incomplete session
     *
     * @param {CreateInCompleteSessionInfo} createInCompleteSessionInfo
     * @returns {(Promise<InCompleteSessionEntity | null>)}
     * @memberof InCompleteSessionRepository
     */
    async createAndSave(
        createInCompleteSessionInfo: CreateInCompleteSessionInfo,
    ): Promise<InCompleteSessionEntity> {
        // set incomplete session data
        const inCompleteSession = new InCompleteSessionModel();
        inCompleteSession.author = createInCompleteSessionInfo.author;

        inCompleteSession.createdDate = createInCompleteSessionInfo.createdDate;

        inCompleteSession.sessionForm = createInCompleteSessionInfo.sessionForm;

        // create incomplete session in db
        const createInCompleteSession = await this.manager.save(
            inCompleteSession,
        );

        // convert to entity class
        return Mapper.map(createInCompleteSession, InCompleteSessionEntity);
    }

    /**
     * Find incomplete session by id
     *
     * @param {string} id
     * @returns {Promise<InCompleteSessionEntity | null>}
     * @memberof InCompleteSessionRepository
     */
    async findById(id: string): Promise<InCompleteSessionEntity | null> {
        // find incomplete session instance by id
        const inCompleteSession = await this.repository.findOne(id);

        return inCompleteSession
            ? Mapper.map(inCompleteSession, InCompleteSessionEntity)
            : null;
    }

    /**
     * Delete incomplete session by id
     * @param {string} id
     * @return {Promise<void>}
     */
    async delete(id: string): Promise<void> {
        await this.mRepository.delete(id);
    }

    async list(
        filter: InCompleteSessionsFilterInfo,
    ): Promise<[InCompleteSessionEntity[], number]> {
        const query:
            | FindConditions<InCompleteSessionModel>
            | ObjectLiteral = {};

        if (filter.author) {
            query.author = filter.author;
        }

        if (filter.name) {
            query['sessionForm.name'] = filter.name;
        }

        if (filter.title) {
            query['sessionForm.title'] = filter.title;
        }

        const [consumers, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [
            consumers.map(s => Mapper.map(s, InCompleteSessionEntity)),
            count,
        ];
    }

    /**
     *
     * @param {string} id
     * @param {UpdateInCompleteSessionInfo} UpdateInCompleteSessionInfo
     * @memberof InCompleteSessionRepository
     */
    async update(
        id: string,
        updateInCompleteSessionInfo: UpdateInCompleteSessionInfo,
    ): Promise<void> {
        const updateInCompleteSessionData: Partial<InCompleteSessionModel> = _.omit(
            updateInCompleteSessionInfo,
            [
                'name',
                'images',
                'trackSelection',
                'title',
                'notes',
                'recipient',
                'totalDuration',
                'step',
            ],
        );

        if (updateInCompleteSessionInfo.name) {
            updateInCompleteSessionData['sessionForm.name'] =
                updateInCompleteSessionInfo.name;
        }
        if (updateInCompleteSessionInfo.images) {
            updateInCompleteSessionData['sessionForm.images'] =
                updateInCompleteSessionInfo.images;
        }
        if (updateInCompleteSessionInfo.trackSelection) {
            updateInCompleteSessionData['sessionForm.trackSelection'] =
                updateInCompleteSessionInfo.trackSelection;
        }
        if (updateInCompleteSessionInfo.title) {
            updateInCompleteSessionData['sessionForm.title'] =
                updateInCompleteSessionInfo.title;
        }
        if (updateInCompleteSessionInfo.notes) {
            updateInCompleteSessionData['sessionForm.notes'] =
                updateInCompleteSessionInfo.notes;
        }
        if (updateInCompleteSessionInfo.recipient) {
            updateInCompleteSessionData['sessionForm.recipient'] =
                updateInCompleteSessionInfo.recipient;
        }
        if (updateInCompleteSessionInfo.totalDuration) {
            updateInCompleteSessionData['sessionForm.totalDuration'] =
                updateInCompleteSessionInfo.totalDuration;
        }
        if (updateInCompleteSessionInfo.step) {
            updateInCompleteSessionData['sessionForm.step'] =
                updateInCompleteSessionInfo.step;
        }

        updateInCompleteSessionData.updatedDate = new Date();

        await this.manager.update<InCompleteSessionModel>(
            InCompleteSessionModel,
            id,
            updateInCompleteSessionData,
        );
    }

    /**
     * Delete inCompleteSession by consumer id
     *
     * @param {string} consumerId consumer id
     * @returns {Promise<void>}
     * @memberof InCompleteSessionRepository
     */
    async deleteByConsumerId(id: string): Promise<void> {
        await this.mManager.deleteMany<InCompleteSessionModel>(
            InCompleteSessionModel,
            {
                'sessionForm.recipient.id': id,
            },
        );
    }

    /**
     * Delete inCompleteSession by creator id
     *
     * @param {string} creatorId creator id
     * @returns {Promise<void>}
     * @memberof InCompleteSessionRepository
     */
    async deleteByCreatorId(id: string): Promise<void> {
        await this.mManager.deleteMany<InCompleteSessionModel>(
            InCompleteSessionModel,
            {
                author: id,
            },
        );
    }

    /**
     * Delete inCompleteSession by creator id and consumer id
     * Used when organizations remove the connection between consumer and creator
     *
     * @param {string[]} creatorIds creator id
     * @param {string} consumerId consumer id
     * @returns {Promise<void>}
     * @memberof InCompleteSessionRepository
     */
    async deleteByCreatorIdAndConsumerId(
        creatorIds: string[],
        consumerId: string,
    ): Promise<void> {
        await this.mManager.deleteMany<InCompleteSessionModel>(
            InCompleteSessionModel,
            {
                author: {
                    $in: creatorIds,
                },
                'sessionForm.recipient.id': consumerId,
            },
        );
    }
}
