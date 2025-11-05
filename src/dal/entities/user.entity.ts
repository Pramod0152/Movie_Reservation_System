import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserEntity extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;
}
