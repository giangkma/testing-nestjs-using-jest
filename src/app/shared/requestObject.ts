interface RequestError {
    parameter: string;
    message: string;
}

export abstract class RequestObject {
    /**
     * Check if this request object is valid
     *
     * @abstract
     * @returns {boolean}
     * @memberof RequestObjectBase
     */
    abstract isValid(): boolean;
}

export class InvalidRequestObject extends RequestObject {
    public errors: RequestError[] = [];

    /**
     * Add error to invalid object
     *
     * @param {string} parameter
     * @param {string} message
     * @memberof InvalidRequestObject
     */
    addError(parameter: string, message: string): void {
        this.errors.push({
            parameter,
            message,
        });
    }

    /**
     * Add error from map
     *
     * @param {(string | Array<string> | Record<string, string>)} errors
     * @memberof InvalidRequestObject
     */
    addErrorMap(errors: string | Array<string> | Record<string, string>): void {
        if (typeof errors === 'string') {
            this.addError('', errors);
        } else if (Array.isArray(errors)) {
            errors.forEach(e => this.addError('', e));
        } else if (typeof errors === 'object') {
            Object.keys(errors).forEach(k => this.addError(k, errors[k]));
        }
    }

    /**
     * Check if request object has error
     *
     * @returns {boolean}
     * @memberof InvalidRequestObject
     */
    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    isValid(): boolean {
        return false;
    }
}

export abstract class ValidRequestObject extends RequestObject {
    isValid(): boolean {
        return true;
    }
}

export type RequestObjectBuilder<T extends RequestObject> = (
    ...params: unknown[]
) => T | InvalidRequestObject;

/*------- Type Guards --------*/

export function isInvalidRequestObject(
    req: RequestObject,
): req is InvalidRequestObject {
    return !req.isValid();
}

export function isValidRequestObject(
    req: RequestObject,
): req is InvalidRequestObject {
    return req.isValid();
}
