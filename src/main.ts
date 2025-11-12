import { ApiGenericResponse } from './app/decorator/generic-response.decorator';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './app/logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GenericResponseDto } from './dto/generic-response.dto';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    abortOnError: false,
    rawBody: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Movie Reservation System API')
    .setDescription('The movie reservation API description')
    .addTag('movies')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  app.enableCors();

  const logger: LoggerService = app.get<LoggerService>(LoggerService);
  logger.info('`Swagger is available at http://localhost:' + (process.env.PORT ?? 3000) + '/api`');

  logger.info(
    `🚀 🚀 🚀 Application is running on: ${await app.getUrl()} 🚀 🚀 🚀`,
  );
}
bootstrap();
