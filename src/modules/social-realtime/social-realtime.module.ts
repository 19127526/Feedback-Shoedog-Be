import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {LogFeedBackEntity} from "./entities/log-feedback.entity";
import {LogSocketEntity} from "./entities/log-socket.entity";
import { SocialGatewayV2 } from './events/social-realtime.gateway';
import { SocialRealtimeController } from './controllers/social-realtime.controller';
import { SocialService } from './services/social-realtime.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LogFeedBackEntity, LogSocketEntity]),
    ],
    providers: [
        // {useClass: SocialService, provide: 'ISocialService'},
        // {useClass: LogFeedbackRepository, provide: 'ILogFeedbackRepository'},
        // {useClass: LogSocketRepository, provide: 'ILogSocketRepository'},
        SocialService,
        SocialGatewayV2
    ],
    exports: [
        SocialGatewayV2
    ],
    controllers: [SocialRealtimeController],
})
export class SocialModule {}
