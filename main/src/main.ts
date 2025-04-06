import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  /**App initialization and logger */
  const app = await NestFactory.create<INestApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'JK-POC',
    }),
  });

  /** Initialization of config service */
  const configService = app.get(ConfigService);

  /**Swagger for APi setup */
  const config = new DocumentBuilder()
    .setTitle('API Swagger')
    .setDescription('The JK POC API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api', app, documentFactory);

  /**Get Port number from config service */
  const port = configService.get<number>('port', 3030);

  await app.listen(port);
  const appUrl = await app.getUrl();

  Logger.log(`~ Application is running on: ${appUrl}`);
}
bootstrap();
