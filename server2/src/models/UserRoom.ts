import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import User from './User';
import Room from './Room';

@Table({
  tableName: 'user_rooms',
  timestamps: true
})
export default class UserRoom extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId!: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  roomId!: string;
} 