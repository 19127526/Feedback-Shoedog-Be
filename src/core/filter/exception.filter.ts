import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '../logger/logger.custom';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}

    private static handleResponse(response: Response, exception: HttpException | Error): void {
        let responseBody: any = { message: 'Internal server error' };
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            responseBody = exception.getResponse();
            statusCode = exception.getStatus();
        } else if (exception instanceof Error) {
            responseBody = {
                statusCode: statusCode,
                message: exception.stack,
            };
        }

        response.status(statusCode).send({
            status: statusCode,
            result: 0,
            message: responseBody.message,
            data: null,
            error: exception,
        });
    }

    catch(exception: HttpException | Error, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse();

        // Handling error message and logging
        this.handleMessage(exception);

        // Response to client
        AllExceptionFilter.handleResponse(response, exception);
    }

    private handleMessage(exception: HttpException | Error): void {
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            message = JSON.stringify(exception.getResponse());
        } else if (exception instanceof Error) {
            message = exception.stack.toString();
        }

        this.logger.error(message);
    }
}
