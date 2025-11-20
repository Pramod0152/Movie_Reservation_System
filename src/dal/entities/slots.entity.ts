import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Screen } from './screens.entity';
import { Movie } from './movie.entity';

@Table({
  tableName: 'slots',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Slot extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  @ForeignKey(() => Screen)
  screen_id: number;

  @Column
  @ForeignKey(() => Movie)
  movie_id: number;

  @Column
  start_time: Date;

  @Column
  end_time: Date;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
