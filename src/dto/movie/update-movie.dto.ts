import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  release_date?: Date;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  rating?: number;
}
