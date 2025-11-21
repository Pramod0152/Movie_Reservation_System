import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScreenDto {
  @ApiPropertyOptional()
  name?: string;
}
