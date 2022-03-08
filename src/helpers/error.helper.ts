import { ValidationError } from 'class-validator';

/**
 * Convert validation error list to error string list
 *
 * @export
 * @param {ValidationError[]} vErrs
 * @returns {string[]}
 */
export function validationErrorToString(vErrs: ValidationError[]): string[] {
    return vErrs.reduce((prev, curr) => {
        const msgs = curr.constraints
            ? Object.keys(curr.constraints).map(
                  k => `${k}: ${curr.constraints[k]}`,
              )
            : [];

        return [...prev, ...msgs];
    }, []);
}
