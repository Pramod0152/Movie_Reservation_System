import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadMovieDto {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
