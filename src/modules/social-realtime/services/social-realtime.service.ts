import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogFeedBackEntity, RATE_FEEDBACK } from '../entities/log-feedback.entity';
import { LogSocketEntity } from '../entities/log-socket.entity';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { SocialGatewayV2 } from '../events/social-realtime.gateway';

@Injectable()
export class SocialService  {
    constructor(
        @InjectRepository(LogFeedBackEntity)
        private logFeedbackRepository: Repository<LogFeedBackEntity>,
        @InjectRepository(LogSocketEntity)
        private logSocketRepository: Repository<LogSocketEntity>,
        @Inject(forwardRef(() => SocialGatewayV2))  // Đảm bảo rằng module chứa SocialGatewayV2 đã được import
        private readonly socialGatewayV2: SocialGatewayV2
    ) {
    }

    removeLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.delete(socketId)
    }

    async checkLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.findBy({
            socket_id: socketId
        })
    }

    createLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.save({
           socket_id: socketId
        }) as any
    }

    async createFeedback(body: CreateFeedbackDto): Promise<any> {
        try {
            const result = await this.logFeedbackRepository.save({
                note: JSON.stringify(body),
                status: 0
            });
            await this.socialGatewayV2.emitSendNotiFeedback(body)
            return result;
        }
        catch (err) {
            console.error('Insert error:', err);
        }
    }
}
