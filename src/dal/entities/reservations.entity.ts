import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Slot } from './slots.entity';
import { User } from './user.entity';
import { Seat } from './seats.entity';

@Table({
  tableName: 'reservations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Reservation extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  @ForeignKey(() => User)
  user_id: number;

  @Column
  @ForeignKey(() => Slot)
  slot_id: number;

  @Column
  @ForeignKey(() => Seat)
  seat_id: number;

  @Column
  reserved_at: Date;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
