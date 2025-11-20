import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Screen } from './screens.entity';

@Table({
  tableName: 'seats',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Seat extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  @ForeignKey(() => Screen)
  screen_id: number;

  @Column
  seat_number: number;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
