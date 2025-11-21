import { ApiProperty } from '@nestjs/swagger';

class TheaterMovieSlotDto {
  @ApiProperty()
  slot_id: number;

  @ApiProperty()
  screen_id: number;

  @ApiProperty()
  screen_name: string;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;
}

export class TheaterMoviesDto {
  @ApiProperty()
  movie_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: () => [TheaterMovieSlotDto] })
  slots: TheaterMovieSlotDto[];
}
