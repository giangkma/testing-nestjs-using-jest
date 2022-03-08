import {
    ConsumerEntity,
    CreateConsumerPayload,
    UpdateConsumerPayload,
} from '@src/domain/consumer';

import { transformAndValidateSync } from 'class-transformer-validator';

export type ConsumerEntityDataType = Omit<ConsumerEntity, 'isActive'>;

/**
 * Create consumer entity with new data
 *
 * @param {ConsumerEntityDataType} [data]
 * @returns {ConsumerEntity}
 */
export function consumerEntityFactory(
    data: ConsumerEntityDataType,
): ConsumerEntity {
    return transformAndValidateSync(ConsumerEntity, data);
}

/**
 * Create consumer in db with new data
 *
 * @param {ConsumerInDB} [data]
 * @returns {ConsumerInDB}
 */
export function consumerInDBFactory(data) {
    return;
}

/**
 * Create consumer create info with new data
 *
 * @export
 * @param {CreateConsumerPayload} [data]
 * @returns {CreateConsumerPayload}
 */
export function consumerCreateInfoFactory(
    data: CreateConsumerPayload,
): CreateConsumerPayload {
    return transformAndValidateSync(CreateConsumerPayload, data);
}

/**
 * Update consumer info with new data
 *
 * @export
 * @param {CreateConsumerPayload} [data]
 * @returns {CreateConsumerPayload}
 */
export function consumerUpdateInfoFactory(
    consumerInfo: UpdateConsumerPayload,
): UpdateConsumerPayload {
    return transformAndValidateSync(UpdateConsumerPayload, consumerInfo);
}
