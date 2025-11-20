import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'theaters',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Theater extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  location: string;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
