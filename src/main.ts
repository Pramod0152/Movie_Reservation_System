import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './app/logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    abortOnError: false,
    rawBody: true,
  });

  const globalPrefix = 'api/v1';
  const swaggerPath = 'api/docs';

  app.setGlobalPrefix(globalPrefix);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Movie Reservation System API')
    .setDescription('The movie reservation API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    deepScanRoutes: true,
  });
  SwaggerModule.setup(swaggerPath, app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  const logger: LoggerService = app.get<LoggerService>(LoggerService);
  logger.info('Swagger is available at http://localhost:' + port + '/' + swaggerPath);

  logger.info(
    `🚀 🚀 🚀 Application is running on: ${await app.getUrl()} 🚀 🚀 🚀`,
  );
}
bootstrap();
