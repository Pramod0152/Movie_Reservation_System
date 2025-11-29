import { ApiProperty } from '@nestjs/swagger';

export class FilterSeatDto {
  @ApiProperty()
  screen_id: number;
}
