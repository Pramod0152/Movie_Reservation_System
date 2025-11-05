import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './app/logger/logger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    abortOnError: false,
    rawBody: true,
  });
  await app.listen(process.env.PORT ?? 3000);

  app.enableCors();

  const logger: LoggerService = app.get<LoggerService>(LoggerService);

  logger.info(
    `🚀 🚀 🚀 Application is running on: ${await app.getUrl()} 🚀 🚀 🚀`,
  );
}
bootstrap();
