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
import {Logger, UseInterceptors, } from '@nestjs/common';
import {CONSTANT_V2, EMIT_TYPE} from 'src/constant/common.const';
import {SocketIOInterceptor} from 'src/core/interceptors/socketio.interceptor';
import { decryptString } from '../../../utils/helper';
import { CommonEmitDto } from '../dto/common-emit.dto';
import { SocialService } from '../services/social-realtime.service';
import { SendResultFeedbackDto } from '../dto/send-result-feedback.dto';

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
        private readonly socialService: SocialService,
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
            const decryptValue = decryptString(query.code)
            const parseValue = JSON.parse(decryptValue) ?? null
            if(parseValue && parseValue?.status === 1994) {
                await this.socialService.createLogSocket(socketId)
                const newData = await this.socialService.getNewLogFeedBack()
                client.emit(
                    EMIT_TYPE.RESULT_CONNECT,
                    {
                        data: socketId,
                        message: 'Kết nối socket thành công',
                        result: 0,
                    } as CommonEmitDto
                );
                if(newData) {
                    client.emit(
                        EMIT_TYPE.RESULT_EVENT_SEND_FEEDBACK,
                        {
                            data: newData,
                            message: 'Bạn có hóa đơn mới cần đánh giá',
                            result: 0,
                        } as CommonEmitDto
                    )
                }
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



    //send app when kiot viet received bill
    async emitSendNotiFeedback(billInfo: any) {
        this.server.emit(
            EMIT_TYPE.RESULT_EVENT_SEND_FEEDBACK,
            {
                data: billInfo,
                message: 'Bạn có hóa đơn mới cần đánh giá',
                result: 0,
            } as CommonEmitDto
        )
        return;
    }

    @SubscribeMessage(CONSTANT_V2.EVENT_SEND_SUBMIT_FEEDBACK)
    async handleSendFeedback(@ConnectedSocket() client: Socket, @MessageBody() body: SendResultFeedbackDto) {
        if (client && client.id && body?.socket_id && body?.id && body?.feedback) {
            const result  = await this.socialService.updateFeedbackById(body)
            client.emit(
                EMIT_TYPE.RESULT_EVENT_SEND_SUBMIT_FEEDBACK,
                {
                    data: result.data,
                    message: result.message,
                    result: result?.isError === true ? -1 : 0,
                } as CommonEmitDto
            )
        } else {
            client.emit(
                EMIT_TYPE.RESULT_EVENT_SEND_SUBMIT_FEEDBACK,
                {
                    data: null,
                    message: 'Vui lòng truyền đầy đủ thông tin',
                    result: -1,
                } as CommonEmitDto
            )
        }
    }

    @SubscribeMessage(CONSTANT_V2.EVENT_DISCONNECT)
    async handleDisconnect(@ConnectedSocket() client: Socket) {
        if (client && client.id) {
            this.socialService.removeLogSocket(client.id)
            client.disconnect()
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
