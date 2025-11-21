import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  release_date: Date;

  @ApiProperty()
  duration: number;

  @ApiPropertyOptional()
  rating?: number;
}
