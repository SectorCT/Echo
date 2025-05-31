import { Table, Column, Model, DataType, HasMany, BelongsToMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import Room from './Room';
import Friend from './Friend';
import UserRoom from './UserRoom';

@Table({
  tableName: 'users',
  timestamps: true
})
export default class User extends Model {
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
  usernameToken!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  friendToken!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  identityPublicKey?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  signedPrekeyPublicKey?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @HasMany(() => Friend)
  friends!: Friend[];

  @BelongsToMany(() => Room, () => UserRoom)
  rooms!: Room[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 12);
    }
  }
} 