import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { GenericResponseDto } from '../../dto/generic-response.dto';

export const ApiGenericResponse = <T extends { type: any; isArray?: boolean; status?: number }>(
  obj: T,
) => {
  const target =
    typeof obj.type === 'function' &&
    (obj.type.prototype === undefined ||
      !(obj.type as any).name ||
      (obj.type as any).name === 'type')
      ? obj.type()
      : obj.type;
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
                  items: { $ref: getSchemaPath(target) },
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
                data: { $ref: getSchemaPath(target) },
              },
            },
          ],
        },
      }),
    );
  }
};
