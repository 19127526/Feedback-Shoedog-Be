import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: number;
    result: number;
    message: string;
    data: T;
    error: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        if (response && response.status) {
            return next.handle().pipe(
                map((data) => {
                    if (response) {
                        const status = data?.status || 200;
                        response.status(status);
                        return {
                            status: status,
                            result: data?.result || 0,
                            message: data?.message || 'Success',
                            data: data?.data || null,
                            error: data?.error || null,
                        };
                    }
                }),
            );
        } else {
            return next.handle();
        }
    }
}
