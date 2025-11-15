import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '../logger/logger';
import { ConfigService } from '@nestjs/config';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { Meta } from '../../dto/meta.dto';
import { ErrorCodeType, SeverityType } from '../lib/enum';

@Catch()
export class ExceptionsFilterService implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    /** Return terminus error as it is. */
    if (exception.name == 'ServiceUnavailableException') {
      return response.status(this.getStatusCode(exception)).json(exception);
    }

    /** Create error res object. */
    const res: GenericResponseDto<any> = { message: '', data: {}, meta: new Meta({}) };
    res.message = exception.message || ErrorCodeType.DefaultErrorMessage;
    res.meta.path = request.url || '';
    res.meta.method = request.method || '';
    res.meta.timestamp = new Date();
    res.meta.httpStatusCode = this.getStatusCode(exception);
    res.meta.code = ErrorCodeType.GeneralException;
    res.meta.severity = SeverityType.error;
    res.meta.stack = exception.stack || '';
    /** In case of httpException */
    if (exception instanceof HttpException) {
      const excep = exception.getResponse();
      res.message = (excep as any).message || exception.message;
      res.meta.code = (excep as any).code || ErrorCodeType.GeneralException;
      res.meta.severity = (excep as any).severity || SeverityType.error;
    }

    /** Log the error with application_id*/
    const errorLog = this.getErrorLog(res);
    this.logger.error(`👿👿 👿👿 ${errorLog}`);

    /** If error is critical, log as critical, with application ID */
    if (this.isCritical(res)) {
      this.logger.crit(`👿👿 👿👿 ${errorLog}`);
    }

    return response.status(res.meta.httpStatusCode).json(res);
  }
  private getStatusCode(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Define custome critical condition
   * @param errorResponse
   * @returns
   */
  private isCritical(errorResponse: GenericResponseDto<any>): boolean {
    /** 1- If error is type of 500 it is critical */
    if (
      errorResponse.meta &&
      errorResponse.meta.httpStatusCode == HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      return true;
    }
    /** 2- If the sevrity level is less then 3 (ie: emerg = 0, alert = 1, crit = 2)  */
    if (errorResponse.meta && Number(errorResponse.meta.severity) < 3) {
      return true;
    }

    return false;
  }

  /**
   * Returns string for the log.
   * @param errorResponse
   * @returns
   */
  private getErrorLog(errorResponse: GenericResponseDto<any>): string {
    const message: string = errorResponse.message;
    const { httpStatusCode, method, path, stack } = errorResponse.meta;

    const errorLog = ` : 🔥 🔥  ${errorResponse.message}  🔥 🔥 \n 
            RESPONSE CODE: ${httpStatusCode}  METHOD: ${method}   URL: ${path} \n
            Stack: ${stack ? stack : message}
        `;
    return errorLog;
  }
}
