import {
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    ResponseError,
    ResponseFailure,
    ResponseSuccess,
    isResponseFailureObject,
    isResponseSuccessObject,
} from '@src/app/shared/responseObject';

import { ApplicationException } from '@src/interfaces/shared/exceptions/applicationException';

/**
 * Handle response return from use case
 *
 * @export
 * @template T
 * @param {(ResponseSuccess<T> | ResponseFailure)} result
 * @returns {T}
 */
export function responseHandler<T = unknown>(
    result: ResponseSuccess<T> | ResponseFailure,
): T {
    if (isResponseFailureObject(result)) {
        // handle response failure error
        switch (result.type) {
            // Client / resource error
            case ResponseError.RESOURCE_ERROR:
                throw new ApplicationException(result.message);

            // Client bad request error
            case ResponseError.PARAMETERS_ERROR:
                throw new BadRequestException(result.message);

            // System error
            default:
                throw new InternalServerErrorException(result.message);
        }
    } else if (isResponseSuccessObject(result)) {
        // handle response success object
        return result.value;
    }

    return result;
}
