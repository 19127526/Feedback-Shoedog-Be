import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './config/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmetFastify from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { monoLogger } from './core/middlewares/handleLogger.middleware';
import { initRequestMiddleware } from './core/middlewares/initReq.middleware';
import { TransformInterceptor } from './core/interceptors/transform.response.interceptor';
import { createDocument } from './core/swagger/swagger';
import compression from '@fastify/compress';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 52428800 }));

    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(configService.get<string>('baseUrl'));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.getHttpAdapter().getInstance().addHook('preHandler', initRequestMiddleware);
    app.getHttpAdapter().getInstance().addHook('onSend', monoLogger);
    // the next two lines did the trick
    app.enableCors()
    app.register(helmetFastify, {
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
    });


    app.register(fastifyStatic, {
        root: join(__dirname, '..', 'public/static'),
        prefix: `${configService.get<string>('baseUrl')}/static`,
    });

    await app.register(compression, { encodings: ['gzip', 'deflate'], threshold: 50 * 1024 });

    SwaggerModule.setup(`${configService.get<string>('baseUrl')}/api-docs`, app, createDocument(app, SWAGGER_CONFIG));

    const port = configService.get<number>('port');
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port: ${port}`);
    if (configService.get<number>('debugMode') === 0) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        console.log = function () {};
    }
}
bootstrap();
