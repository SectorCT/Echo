import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Room from './Room';

@Table({
  tableName: 'messages',
  timestamps: true
})
export default class Message extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  roomId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  authorId!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  content!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  imageUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isSeen!: boolean;

  @BelongsTo(() => Room)
  room!: Room;

  @BelongsTo(() => User)
  author!: User;
} 