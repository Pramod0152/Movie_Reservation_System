import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSlotDto {
  @ApiPropertyOptional()
  movie_id?: number;

  @ApiPropertyOptional()
  start_time?: Date;

  @ApiPropertyOptional()
  end_time?: Date;
}
