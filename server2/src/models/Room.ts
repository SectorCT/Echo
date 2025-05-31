import { Table, Column, Model, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import User from './User';
import Message from './Message';
import UserRoom from './UserRoom';

@Table({
  tableName: 'rooms',
  timestamps: true
})
export default class Room extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  name!: string;

  @BelongsToMany(() => User, () => UserRoom)
  users!: User[];

  @HasMany(() => Message)
  messages!: Message[];
} 