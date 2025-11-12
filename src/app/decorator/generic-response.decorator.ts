import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GenericResponseDto } from '../../dto/generic-response.dto';

export const ApiGenericResponse = <
  T extends { type: any; isArray?: boolean; status?: number },
>(
  obj: T,
) => {
  if (obj.isArray) {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(GenericResponseDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(obj.type) },
                },
              },
            },
          ],
        },
      }),
    );
  } else {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(GenericResponseDto) },
            {
              properties: {
                data: { $ref: getSchemaPath(obj.type) },
              },
            },
          ],
        },
      }),
    );
  }
};
