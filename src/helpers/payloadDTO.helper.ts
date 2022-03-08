import { Transform } from 'class-transformer';

/**
 * Query param array single element input as string,
 * convert to array
 *
 */
export const TransformQueryArray = () =>
    Transform(value => {
        if (Array.isArray(value)) {
            return value;
        }

        return [value];
    });

/**
 * Query field always is string,
 * convert to number for dto field
 *
 */
export const TransformQueryNumber = () => Transform(value => Number(value));
