import {
    AbstractRepository,
    AggregationCursor,
    EntityRepository,
    MongoRepository,
    getMongoRepository,
} from 'typeorm';

import { DownloadCsvFilterInfo } from '@src/domain/sessionLog';
import { LogModel } from '@src/infra/database/model';

@EntityRepository(LogModel)
export class SessionLogRepository extends AbstractRepository<LogModel> {
    private readonly mRepository: MongoRepository<LogModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(LogModel);
    }

    /**
     * Filter session logs
     *
     * @param {DownloadCsvFilterInfo} filter
     * @returns {AggregationCursor<LogModel>}
     * @memberof SessionLogRepository
     */
    getCursor(filter: DownloadCsvFilterInfo): AggregationCursor<LogModel> {
        const agg = [];

        if (filter.userId) {
            agg.push({
                $match: { userId: filter.userId },
            });
        }

        agg.push({ $unwind: '$items' });
        
        if (filter.startTime && filter.endTime) {
            agg.push({
                $match: {
                    'items.time': { $gte: filter.startTime, $lt: filter.endTime },
                },
            });
        }

        if (filter.type) {
            agg.push({
                $match: { 'items.targetEndpoint': filter.type },
            });
        }

        agg.push(
            { $addFields: { 'items.userId': '$userId' } },
            { $replaceRoot: { newRoot: '$items' } },
            { $addFields: { 'payload.userId': '$userId' } },
            { $replaceRoot: { newRoot: '$payload' } },
        );

        return this.mRepository.aggregateEntity(agg);
    }
}
