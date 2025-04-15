import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { writeLogEventSocket } from '../helpers/any.helper';

@Injectable()
export class SocketIOInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap((responseBody) => {
                try {
                    const socket = context.switchToWs().getClient() as Socket;
                    const data = context.switchToWs().getData();
                    // console.log('SocketIOInterceptor data: ', data);
                    const eventName = context.getHandler().name;
                    writeLogEventSocket(socket, data, eventName, responseBody)
                } catch (error) {
                    console.log('SocketIOInterceptor error: ', error.message);
                }
            })
        );
    }
}
