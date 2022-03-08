import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import APIConfig from '@src/config/api.config';
import AppConfig from '@src/config/configuration';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import Configuration from '@src/config/configuration';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule, {
            // TODO: configure cors when deploy
            cors: true,
        });

        // get api and app config
        const apiConfig = await app.get<string, ConfigType<typeof APIConfig>>(
            APIConfig.KEY,
        );
        const appConfig = await app.get<string, ConfigType<typeof AppConfig>>(
            AppConfig.KEY,
        );
        // set app global api path prefix
        app.setGlobalPrefix(apiConfig.api_v1);

        // Transform and validate payload objects global
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );

        // setup swagger
        const options = new DocumentBuilder()
            .setTitle(appConfig.app_name)
            .setDescription('App API description')
            .setVersion(apiConfig.api_version)
            .addBearerAuth({
                type: 'http',
            })
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(apiConfig.swagger_enpoint, app, document);

        // get general configuration
        const configuration = await app.get<
            string,
            ConfigType<typeof Configuration>
        >(Configuration.KEY);

        // start app at configured port
        await app.listen(configuration.port);
    } catch (e) {
        console.error(e);
    }
}

bootstrap();
