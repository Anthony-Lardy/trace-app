import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

import { conf } from '@common/config-bucket';
import { AppModule } from './app.module';

const server = express();

export const createServer = async (expressInstance) => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
        cors:{
            origin: [
              /^(.*)/,
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 200,
            credentials: true,
            allowedHeaders:
              'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
          },
    });
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Trace App')
        .setDescription('API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    return app.init();
};

createServer(server)
    .then(async (app) => {
        await app.listen(conf.PORT);
        Logger.log(`Nest Express server start on port ${conf.PORT}`);
        process.on('SIGTERM', () => app.close());
        process.on('SIGINT', () => app.close());
    })
    .catch((error) => {
        Logger.error(error, `Critical microservice failure`);
        process.exit(1);
    });
