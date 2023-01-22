import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import {
  APPLICATION_NAME,
  APPPLICATION_DESCRIPTION,
} from './common/constants/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept,Authorization',
  };
  app.enableCors(corsOptions);
  const options = new DocumentBuilder()
    .setTitle(APPLICATION_NAME)
    .setDescription(APPPLICATION_DESCRIPTION)
    .setVersion('1.0')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000, process.env.HOST || '0.0.0.0');
}

bootstrap();
