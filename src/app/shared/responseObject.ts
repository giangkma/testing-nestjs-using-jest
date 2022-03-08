import { InvalidRequestObject } from './requestObject';

export abstract class ResponseObject {
    /**
     * Check if this response object is valid
     *
     * @abstract
     * @returns {boolean}
     * @memberof ResponseObjectBase
     */
    abstract isValid(): boolean;
}

export class ResponseSuccess<T = unknown> extends ResponseObject {
    constructor(public value: T) {
        super();
    }

    public isValid(): boolean {
        return true;
    }
}

export enum ResponseError {
    RESOURCE_ERROR = 'RESOURCE_ERROR',
    PARAMETERS_ERROR = 'PARAMETERS_ERROR',
    SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export interface ApplicationError {
    type: ResponseError;
    message: string;
}

export type FailureMessage = Error | string;

export class ResponseFailure extends ResponseObject {
    public type: ResponseError;
    public message: string;

    constructor(type: ResponseError, message: FailureMessage) {
        super();
        this.type = type;
        this.message = this.formatMessage(message);
    }

    get value(): ApplicationError {
        return {
            type: this.type,
            message: this.message,
        };
    }

    private formatMessage(msg: FailureMessage): string {
        if (msg instanceof Error) {
            return `${msg.name}: ${msg.message}`;
        }

        return msg;
    }

    public isValid(): boolean {
        return false;
    }

    public static buildResourceError(msg: FailureMessage): ResponseFailure {
        return new ResponseFailure(ResponseError.RESOURCE_ERROR, msg);
    }

    public static buildParameterError(msg: FailureMessage): ResponseFailure {
        return new ResponseFailure(ResponseError.PARAMETERS_ERROR, msg);
    }

    public static buildSystemError(msg: FailureMessage): ResponseFailure {
        return new ResponseFailure(ResponseError.SYSTEM_ERROR, msg);
    }

    /**
     * Build failur response from invalid request
     *
     * @static
     * @param {InvalidRequestObject} invalidReqObject
     * @returns {ResponseFailure}
     * @memberof ResponseFailure
     */
    public static buildFromInvalidRequestObject(
        invalidReqObject: InvalidRequestObject,
    ): ResponseFailure {
        const message = invalidReqObject.errors
            .map(e => `${e.parameter}: ${e.message}`)
            .join('\n');

        return new ResponseFailure(ResponseError.PARAMETERS_ERROR, message);
    }
}

/*------- Type Guards --------*/

export function isResponseFailureObject(
    res: ResponseObject,
): res is ResponseFailure {
    return !res.isValid();
}

export function isResponseSuccessObject(
    res: ResponseObject,
): res is ResponseSuccess {
    return res.isValid();
}
