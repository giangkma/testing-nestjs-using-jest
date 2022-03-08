import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    MongoRepository,
    ObjectLiteral,
    getMongoRepository,
} from 'typeorm';
import {
    IPersonalMediaRepository,
    Media,
    PersonalMediaEntity,
    PersonalMediaFilterInfo,
    UploadMediasInfo,
} from '@src/domain/personalMedia';
import { MediaModel, PersonalMediaModel } from '@src/infra/database/model';

import { Mapper } from '@nartc/automapper';
import { ObjectId } from 'bson';

@EntityRepository(PersonalMediaModel)
export class PersonalMediaRepository
    extends AbstractRepository<PersonalMediaModel>
    implements IPersonalMediaRepository {
    private readonly mRepository: MongoRepository<PersonalMediaModel>;

    constructor() {
        super();
        this.mRepository = getMongoRepository(PersonalMediaModel);
    }

    /**
     * Create and save personal media
     *
     * @param {UploadMediasInfo} uploadMediasInfo
     * @returns {(Promise<PersonalMediaEntity | null>)}
     * @memberof PersonalMediaRepository
     */
    async createAndSave(
        uploadMediasInfo: UploadMediasInfo,
    ): Promise<PersonalMediaEntity> {
        // set personal media data
        const personalMedia = new PersonalMediaModel();
        personalMedia.consumerId = uploadMediasInfo.consumerId;
        personalMedia.uploaderId = uploadMediasInfo.uploaderId;

        personalMedia.createdDate = uploadMediasInfo.createdDate;
        personalMedia.medias = uploadMediasInfo.medias.map(media =>
            Mapper.map(media, MediaModel),
        );

        personalMedia.createdDate = new Date();

        // create personal media in db
        const createdpersonalMedia = await this.manager.save(personalMedia);

        // convert to entity class
        return Mapper.map(createdpersonalMedia, PersonalMediaEntity);
    }

    /**
     * Find personal media by consumerId + uploaderId
     *
     * @param {string} consumerId
     * @param {string} uploaderId
     * @returns {(Promise<PersonalMediaEntity | null>)}
     * @memberof PersonalMediaRepository
     */
    async findByConsumerIdAndUploaderId(
        consumerId: string,
        uploaderId: string,
    ): Promise<PersonalMediaEntity | null> {
        // get personal media model instance by consumerId + uploaderId
        const res = await this.repository.find({
            where: {
                consumerId,
                uploaderId,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // personal media is first element in array since consumerid and uploaderId are unique
        return Mapper.map(res[0], PersonalMediaEntity);
    }

    /**
     * Find personal media by consumerId
     *
     * @param {string} consumerId
     * @returns {(Promise<PersonalMediaEntity | null>)}
     * @memberof PersonalMediaRepository
     */
    async findByConsumerId(
        consumerId: string,
    ): Promise<PersonalMediaEntity[] | null> {
        // get personal media model instance by consumerId
        const res = await this.repository.find({
            where: {
                consumerId,
            },
        });

        // return null if empty result array
        if (res.length < 1) return null;

        // personal media is first element in array since consumerid and uploaderId are unique
        return res.map(s => Mapper.map(s, PersonalMediaEntity));
    }

    /**
     * Find personal media by id
     *
     * @param {string} id
     * @returns {Promise<PersonalMediaEntity>}
     * @memberof PersonalMediaRepository
     */
    async findById(id: string): Promise<PersonalMediaEntity | null> {
        // find personal model instance by id
        const personalMedia = await this.repository.findOne(id);

        return personalMedia
            ? Mapper.map(personalMedia, PersonalMediaEntity)
            : null;
    }

    /**
     * Only add new media to list
     *
     * @param {UploadMediasInfo} uploadMediasInfo
     * @param {string} id
     * @returns {Promise<void)}
     * @memberof PersonalMediaRepository
     */
    async uploadMedias(
        id: string,
        uploadMediasInfo: UploadMediasInfo,
    ): Promise<void> {
        const medias = uploadMediasInfo.medias.map(media =>
            Mapper.map(media, MediaModel),
        );

        const res = await this.mRepository.updateOne(
            {
                _id: new ObjectId(id),
                'medias.id': { $nin: medias.map(m => m.id) },
            },
            {
                $addToSet: {
                    medias: { $each: medias },
                },
                $set: {
                    updatedDate: new Date(),
                },
            },
        );

        if (res.modifiedCount < 1) {
            // If media already exits in list medias, return update failed error
            throw new Error('Update failed');
        }
    }

    /**
     * Update medias list
     *
     * @param {string} id
     * @param {PersonalMediaEntity} currentPersonalMedia
     * @param {Media[]} updateMediaInfo
     * @returns {Promise<void>)}
     * @memberof PersonalMediaRepository
     */
    async updateMedia(id: string, updateMediaInfo: Media[]): Promise<void> {
        const res = await this.mRepository.updateOne(
            {
                _id: new ObjectId(id),
                'medias.id': {
                    $in: updateMediaInfo.map(m => m.id),
                },
            },
            {
                $set: {
                    medias: updateMediaInfo,
                },
            },
        );

        if (res.modifiedCount < 1) {
            // source does not change or incorrect mdeia id, return update failed error
            throw new Error('Update failed');
        }
    }

    /**
     * Remove media from list
     *
     * @param {string} id personal media id
     * @param {string[]} mediaIds list media ids
     * @returns {Promise<void>}
     * @memberof PersonalMediaRepository
     */
    async removeMedia(id: string, mediaIds: string[]): Promise<void> {
        await this.mRepository.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $pull: {
                    medias: {
                        id: {
                            $in: mediaIds,
                        },
                    },
                },
            },
        );
    }

    /**
     * Filter personal medias
     *
     * @param {PersonalMediaFilterInfo} filter
     * @returns {(Promise<[PersonalMediaEntity[], number] | null>)}
     * @memberof PersonalMediaRepository
     */
    async list(
        filter: PersonalMediaFilterInfo,
    ): Promise<[PersonalMediaEntity[], number]> {
        const query: FindConditions<PersonalMediaModel> | ObjectLiteral = {};

        if (filter.consumerId) {
            query.consumerId = filter.consumerId;
        }

        if (filter.uploaderId) {
            query.uploaderId = filter.uploaderId;
        }

        // TODO: Filter list personal media by createdDate and updatedDate

        const [personalMedias, count] = await this.mRepository.findAndCount({
            where: query,
            skip: (filter.pageIndex - 1) * filter.limit,
            take: filter.limit,
        });

        return [
            personalMedias.map(s => Mapper.map(s, PersonalMediaEntity)),
            count,
        ];
    }
}
