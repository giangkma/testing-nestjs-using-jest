import { RequestObject, isInvalidRequestObject } from './requestObject';
import {
    ResponseObject,
    ResponseFailure,
    ResponseSuccess,
    isResponseFailureObject,
} from './responseObject';

export abstract class UseCase<T = unknown> {
    public async execute(
        reqObject: RequestObject,
    ): Promise<ResponseSuccess<T> | ResponseFailure> {
        // return response failure if invalid request
        if (isInvalidRequestObject(reqObject)) {
            return ResponseFailure.buildFromInvalidRequestObject(reqObject);
        }

        try {
            // start process request
            const result = await this.processRequest(reqObject);

            // ensure return response success / failure object
            if (
                result instanceof ResponseSuccess ||
                (result instanceof ResponseObject &&
                    isResponseFailureObject(result))
            ) {
                return result;
            } else {
                return new ResponseSuccess<T>(result as T);
            }
        } catch (e) {
            // print failure stack trace in dev
            if (!(process.env.NODE_ENV === 'production')) {
                console.trace(e);
            }
            // return system error response failure when catch e
            return ResponseFailure.buildSystemError(e);
        }
    }

    public abstract async processRequest(
        reqObject: RequestObject,
    ): Promise<T | ResponseFailure>;
}
