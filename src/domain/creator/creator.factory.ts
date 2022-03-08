import {
    CreateCreatorPayload,
    ListCreatorsPayload,
    UpdateCreatorPayload,
} from './creator.dto';

import { CreatorEntity } from './creator.entity';
import { transformAndValidateSync } from 'class-transformer-validator';

export type CreatorDataType = Omit<CreatorEntity, 'isActive' | 'isAdmin'>;

/**
 * Create creator entity default or with new data
 *
 * @param {Record<string, unknown>} [data]
 * @returns {CreatorEntity}
 */
export function creatorEntityFactory(data: CreatorDataType): CreatorEntity {
    return transformAndValidateSync(CreatorEntity, data);
}

/**
 * Create creator factory
 *
 * @param {Record<string, unknown>} [data]
 * @returns {CreatorEntity}
 */
export function createCreatorFactory(
    data: CreateCreatorPayload,
): CreateCreatorPayload {
    return transformAndValidateSync(CreateCreatorPayload, data);
}

/**
 * Create creator in db with new data
 *
 * @param {CreatorInDB} [data]
 * @returns {CreatorInDB}
 */
export function creatorInDBFactory(data) {
    return;
}

/**
 * Create creator factory
 *
 * @param {UpdateCreatorPayload} [data]
 * @returns {CreatorEntity}
 */
export function updateCreatorFactory(
    data: UpdateCreatorPayload,
): UpdateCreatorPayload {
    return transformAndValidateSync(UpdateCreatorPayload, data);
}

/**
 * List creators factory
 *
 * @param {ListCreatorsPayload} [data]
 * @returns {CreatorEntity}
 */
export function listCreatorsFactory(
    data: ListCreatorsPayload,
): ListCreatorsPayload {
    return transformAndValidateSync(ListCreatorsPayload, data);
}
