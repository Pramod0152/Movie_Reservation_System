import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  private levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  };

  constructor(private configService: ConfigService) {
    this.initializeLogger();
  }

  initializeLogger() {
    // Configure formats
    const consoleFormat = winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}]: ${message}${metaStr}`;
      }),
    );

    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      levels: this.levels,
      level: 'debug',
      // transports: include a Console transport so logs appear in terminal
      transports: [
        // Console transport for development / terminal output
        new winston.transports.Console({
          level: 'debug',
          format: consoleFormat,
        }),
        // File transport for errors (keep existing behavior)
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: fileFormat,
        }),
      ],
    });
  }
  emerg(message: string) {
    this.logger.emerg(message);
  }

  alert(message: string) {
    this.logger.alert(message);
  }

  crit(message: string) {
    this.logger.crit(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warning(message: string) {
    this.logger.warning(message);
  }

  notice(message: string) {
    this.logger.notice(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }
}
