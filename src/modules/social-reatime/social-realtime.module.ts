import { Module } from '@nestjs/common';
import { SocialService } from './services/social-realtime.service';
import { SocialGatewayV2 } from './events/social-realtime.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import {SocialRealtimeController} from "./controllers/social-realtime.controller";
import {LogFeedBackEntity} from "./entities/log-feedback.entity";
import {LogFeedbackRepository} from "./repository/log-feedback.repository";
import {DB_TYPE} from "../../constant/common.const";
import {LogSocketEntity} from "./entities/log-socket.entity";
import {LogSocketRepository} from "./repository/log-socket.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([LogFeedBackEntity, LogSocketEntity], DB_TYPE.DB_CONTENT_WRITE),
    ],
    providers: [
        {useClass: SocialService, provide: 'ISocialService'},
        {useClass: LogFeedbackRepository, provide: 'ILogFeedbackRepository'},
        {useClass: LogSocketRepository, provide: 'ILogSocketRepository'},
        SocialGatewayV2,
    ],
    exports: [
    ],
    controllers: [SocialRealtimeController],
})
export class SocialModule {}
