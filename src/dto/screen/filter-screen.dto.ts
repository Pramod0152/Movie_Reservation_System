import { ApiProperty } from '@nestjs/swagger';

export class FilterScreenDto {
  @ApiProperty()
  theater_id: number;
}
