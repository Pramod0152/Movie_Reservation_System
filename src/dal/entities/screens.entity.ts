import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Theater } from './theaters.entity';

@Table({
  tableName: 'screens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Screen extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  @ForeignKey(() => Theater)
  theater_id: number;

  @Column
  name: string;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
