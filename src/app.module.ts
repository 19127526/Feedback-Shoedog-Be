import { Module } from '@nestjs/common';
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './core/logger/logger.module';
import { config } from './config/config';
import { SocialModule } from './modules/social-reatime/social-realtime.module';
import { DatabaseModule } from './core/database/databases.module';
import { AuthGuard } from './modules/authentication/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import {AllExceptionFilter} from "@devhcm/core-nestjs-fastify";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                config,
            ],
        }),
        DatabaseModule.forRoot(config().connectionsDB),
        SocialModule,
        JwtModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
