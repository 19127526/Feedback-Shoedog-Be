import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogFeedBackEntity } from '../entities/log-feedback.entity';
import { LogSocketEntity } from '../entities/log-socket.entity';
import { SocialGatewayV2 } from '../events/social-realtime.gateway';
import { SendResultFeedbackDto } from '../dto/send-result-feedback.dto';

@Injectable()
export class SocialService {
    constructor(
        @InjectRepository(LogFeedBackEntity)
        private logFeedbackRepository: Repository<LogFeedBackEntity>,
        @InjectRepository(LogSocketEntity)
        private logSocketRepository: Repository<LogSocketEntity>,
        @Inject(forwardRef(() => SocialGatewayV2))  // Đảm bảo rằng module chứa SocialGatewayV2 đã được import
        private readonly socialGatewayV2: SocialGatewayV2,
    ) {
    }

    removeLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.delete({
            socket_id: socketId
        });
    }

    async checkLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.findBy({
            socket_id: socketId,
        });
    }

    //Save log socket when connect socket
    createLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.save({
            socket_id: socketId,
        }) as any;
    }

    async getNewLogFeedBack(): Promise<LogFeedBackEntity> {
        return await this.logFeedbackRepository.findOne({
            where: {
                status: 0,
            },
            order: {
                id: 'ASC',
            },
        });
    }


    //Save feedback when start app
    async createFeedback(billInfo: any): Promise<any> {
        try {
            const data = await this.logFeedbackRepository.save({
                note: JSON.stringify(billInfo),
                status: 0,
                create_date: new Date().toString()
            });
            const result = await this.getNewLogFeedBack()
            await this.socialGatewayV2.emitSendNotiFeedback(result);
            return data;
        } catch (err) {
            console.error('Insert error:', err);
        }
    }


    //Update after app send feedback
    async updateFeedbackById(body: SendResultFeedbackDto): Promise<{isError: boolean, data: LogFeedBackEntity | null, message: string}> {
        try {
            const isExistSocket = await this.checkLogSocket(body.socket_id)

            //check exist socket
            if(!isExistSocket) {
                return {
                    data: null,
                    isError: true,
                    message: 'Socket không hợp lệ'
                }
            }

            const isUpdatedFeedback = await this.logFeedbackRepository.findOne({
                where: {
                    id: body.id,
                    status: 1
                }
            })

            //check exist socket
            if(isUpdatedFeedback) {
                return {
                    data: null,
                    isError: true,
                    message: 'Form này đã được dánh giá'
                }
            }

            await this.logFeedbackRepository.update(body.id,{
                status: 1,
                message: body.message,
                feedback: body.feedback,
            })
            const newData = await this.getNewLogFeedBack() ?? null;

            return {
                isError: false,
                data: newData,
                message: 'Bạn đã gửi đánh giá thành công'
            }

        } catch (err) {
            return {
                isError: true,
                message: err?.message ?? err?.toString(),
                data: null
            }
        }
    }
}
