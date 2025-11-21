import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTheaterDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  location?: string;
}
