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
            host: 's88d41.cloudnetwork.vn',
            port: 3306,
            username: 'sho27414_shoedogdatabase',
            password: 'shoedog1994',
            database: 'sho27414_shoedogdatabase',
            entities: [LogFeedBackEntity, LogSocketEntity],
            logging: false
        }),
        SocialModule
    ],
    controllers: [],
    providers: [
    ],
})
export class AppModule {}
