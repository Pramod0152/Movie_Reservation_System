import { ApiProperty } from '@nestjs/swagger';
import { CreateSeatDto } from './create-seat.dto';

export class CreateSeatLayoutDto {
  @ApiProperty({ type: () => [CreateSeatDto] })
  seats: CreateSeatDto[];
}
