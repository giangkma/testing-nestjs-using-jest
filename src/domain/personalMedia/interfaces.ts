import { Media, PersonalMediaEntity } from './personalMedia.entity';

import { BaseListFilterInfo } from '@src/domain/helper/base.dto';

export interface UploadMediasInfo {
    consumerId: string;
    uploaderId: string;
    medias: Media[];
    createdDate?: Date;
}

export interface PersonalMediaFilterInfo extends BaseListFilterInfo {
    consumerId?: string;
    uploaderId?: string;
}

/**
 * Personal media repository interface for dependency inversion
 *
 * @export
 * @interface IPersonalMediaRepository
 */
export interface IPersonalMediaRepository {
    createAndSave: (
        uploadMediasInfo: UploadMediasInfo,
    ) => Promise<PersonalMediaEntity>;
    findByConsumerIdAndUploaderId: (
        consumerId: string,
        uploaderId: string,
    ) => Promise<PersonalMediaEntity | null>;
    findById: (id: string) => Promise<PersonalMediaEntity | null>;
    uploadMedias: (id, uploadMediasInfo: UploadMediasInfo) => Promise<void>;
    updateMedia: (id: string, updateMediaInfo: Media[]) => Promise<void>;
    removeMedia: (id: string, mediaIds: string[]) => Promise<void>;
    list: (
        filter: PersonalMediaFilterInfo,
    ) => Promise<[PersonalMediaEntity[], number]>;
}
