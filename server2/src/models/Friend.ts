import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Room from './Room';

@Table({
  tableName: 'friends',
  timestamps: true
})
export default class Friend extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  friendId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nickname!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  friendshipToken!: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  roomId!: string;

  @BelongsTo(() => User, 'userId')
  user!: User;

  @BelongsTo(() => User, 'friendId')
  friend!: User;

  @BelongsTo(() => Room)
  room!: Room;
} 