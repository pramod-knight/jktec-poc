import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ConsoleLogger, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
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

  //Handle Dto Class-validation Error
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Optional: If you want to throw an error when unknown properties are provided
      transform: true,
      //The exceptionFactory helps us to control the error message and here we manage message into object from string
      // default the error message will be in array of string
      exceptionFactory: (errors) => {
        const errorMessages = {};
        errors.forEach((error) => {
          errorMessages[error.property] = error.constraints && Object.values(error.constraints)
            .join('. ')
            .trim();
        });
        return new BadRequestException(errorMessages);
      },
      
    }),
  );

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
