import { type } from 'os';

/**
 * parse env variable from string to boolean
 *
 * @export
 * @param {string} variable
 * @returns
 */
export function parseEnvBool(variable: string): boolean {
    if (typeof variable === 'boolean') {
        return variable;
    }

    return variable === 'true' ? true : false;
}
