import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
    constructor(public readonly error: string | Record<string, string>) {
        super(error, HttpStatus.OK);
    }
}
