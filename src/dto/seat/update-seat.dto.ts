import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSeatDto {
  @ApiPropertyOptional()
  seat_number?: number;
}
