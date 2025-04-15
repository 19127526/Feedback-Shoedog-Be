import {ISocialService} from './isocial-realtime.service';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {SocialGatewayV2} from "../events/social-realtime.gateway";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {LogFeedBackEntity} from "../entities/log-feedback.entity";
import {ILogFeedbackRepository} from "../repository/ilog-feedback.repository";
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import {ILogSocketRepository} from "../repository/ilog-socket.repository";

@Injectable()
export class SocialService implements ISocialService {
    constructor(
        @Inject('ILogFeedbackRepository')
        private readonly logFeedbackRepository: ILogFeedbackRepository,

        @Inject('ILogSocketRepository')
        private readonly logSocketRepository: ILogSocketRepository,

        @Inject(forwardRef(() => SocialGatewayV2)) private readonly socialGatewayV2: SocialGatewayV2
    ) {

    }

    removeLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.delete(socketId)
    }

    async checkLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.findById(socketId)
    }

    createLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.store({
            socket_id: socketId
        })
    }

    async createFeedback(body: CreateFeedbackDto): Promise<any> {
        await this.logFeedbackRepository.store({
            note: JSON.stringify(body)
        })
        await this.socialGatewayV2.emitSendNotiFeedback(body)
        return body
    }
}
