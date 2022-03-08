/**
 *
 * @param number
 * @returns {string}
 */
function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

/**
 *
 * Formatted date object to ISO 8601 UTC date-time (without minisecond)
 *
 * @param {Date} d
 * @returns {string}
 */
export function toISOStringWithoutMilisecond(d: Date): string {
    return (
        d.getUTCFullYear() +
        '-' +
        pad(d.getUTCMonth() + 1) +
        '-' +
        pad(d.getUTCDate()) +
        'T' +
        pad(d.getUTCHours()) +
        ':' +
        pad(d.getUTCMinutes()) +
        ':' +
        pad(d.getUTCSeconds()) +
        'Z'
    );
}
