import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialModule } from './modules/social-realtime/social-realtime.module';
import { LogFeedBackEntity } from './modules/social-realtime/entities/log-feedback.entity';
import { LogSocketEntity } from './modules/social-realtime/entities/log-socket.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                config,
            ],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '172.16.247.16',
            port: 3306,
            username: 'hnth',
            password: 'hnth6789mytv',
            database: 'hnth_mytv',
            entities: [LogFeedBackEntity, LogSocketEntity],
            logging: true
        }),
        SocialModule
    ],
    controllers: [],
    providers: [
    ],
})
export class AppModule {}
