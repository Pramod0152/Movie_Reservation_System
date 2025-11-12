import { Injectable } from '@nestjs/common';
import { GenericResponseDto } from '../../dto/generic-response.dto';

@Injectable()
export class ResponseHandlerService {
  constructor() {}

  public async handleResponse(
    data: any,
    message?: string,
  ): Promise<GenericResponseDto<any>> {
    const result: GenericResponseDto<any> = {
      message: message || 'Success',
      data: data || {},
    };
    return result;
  }
}
