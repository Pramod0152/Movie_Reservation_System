import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'movies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Movie extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  release_date: Date;

  @Column
  duration: number;

  @Column
  rating: number;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
