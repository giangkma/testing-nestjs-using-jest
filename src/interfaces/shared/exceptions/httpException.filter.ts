import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from './applicationException';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
    catch(exception: ApplicationException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            success: false,
            error: exception.message,
            path: request.url,
        });
    }
}
