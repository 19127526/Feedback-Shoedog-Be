import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect, MessageBody,
} from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import {Inject, Logger, UseInterceptors, forwardRef} from '@nestjs/common';
import {CONSTANT_V2, EMIT_TYPE} from 'src/constant/common.const';
import {SocketIOInterceptor} from 'src/core/interceptors/socketio.interceptor';
import {ISocialService} from '../services/isocial-realtime.service';
import {encryptString} from "../../../utils/helper";
import {CommonEmitDto} from "../../../../dist/modules/social-reatime/dto/common-emit.dto";

@WebSocketGateway({
    cors: true,
    namespace: '/',
    allowEIO3: true,
    allowEIO2: true,
    pingInterval: 2000,
    pingTimeout: 5000,
})
@UseInterceptors(SocketIOInterceptor)
export class SocialGatewayV2 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private logger: Logger = new Logger(SocialGatewayV2.name);
    @WebSocketServer()
    server: Server;


    constructor(
        @Inject(forwardRef(() => 'ISocialService'))
        private readonly socialService: ISocialService,
    ) {
    }

    afterInit(server: any): void {
        this.logger.log('Initialized!');
    }

    @SubscribeMessage(CONSTANT_V2.EVENT_CONNECTION)
    async handleConnection(@ConnectedSocket() client: Socket) {

        const query = {...client?.handshake?.query} as {
            token: string
            meeting_id: number
        } | any;

        if (query && query.code) {
            const socketId = client.id
            const encryptValue = encryptString(query.code)
            const parseValue = JSON.parse(encryptValue) ?? null
            if(parseValue && parseValue?.status === 1994) {
                this.socialService.createLogSocket(socketId)
                client.emit(
                    EMIT_TYPE.RESULT_CONNECT,
                    {
                        data: socketId,
                        message: 'Kết nối socket thành công',
                        result: 0,
                    } as CommonEmitDto
                );
            } else {
                client.emit(
                    EMIT_TYPE.RESULT_CONNECT,
                    {
                        data: null,
                        message: 'Encrypt thông tin lỗi',
                        result: -1,
                    } as CommonEmitDto
                );
            }
        } else {
            client.emit(
                EMIT_TYPE.RESULT_CONNECT,
                {
                    data: null,
                    message: 'Vui lòng truyền đầy đủ thông tin',
                    result: -1,
                } as CommonEmitDto
            );
        }
    }



    async emitSendNotiFeedback(body: any) {
        this.server.emit(
            EMIT_TYPE.RESULT_SEND_NOTI_FEEDBACK,
            {
                data: body,
                message: 'success',
                result: 0,
            } as CommonEmitDto
        )
        return;
    }

    @SubscribeMessage(CONSTANT_V2.EVENT_SEND_RESULT_FEEDBACK)
    async handleSendFeedback(@ConnectedSocket() client: Socket, @MessageBody() body: {socket_id: number}) {
        if (client && client.id && body?.socket_id) {

        }
    }

    @SubscribeMessage(CONSTANT_V2.EVENT_DISCONNECT)
    async handleDisconnect(@ConnectedSocket() client: Socket) {
        if (client && client.id) {
            this.socialService.removeLogSocket(client.id)
            client.emit(
                EMIT_TYPE.RESULT_CONNECT,
                {
                    data: null,
                    message: 'Rời thành công',
                    result: 0,
                } as CommonEmitDto
            );
        }
    }
}
