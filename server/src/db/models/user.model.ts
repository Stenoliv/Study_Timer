import { nanoid } from "nanoid";
import { DataTypes, Optional } from "sequelize";
import {
  BeforeCreate,
  Column,
  CreatedAt,
  DeletedAt,
  Index,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  Validate,
} from "sequelize-typescript";
import bcrypt from "bcrypt";

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: true,
  paranoid: true,
})
class User extends Model<UserAttributes, UserCreationAttributes> {
  // ID of type nanoid
  @PrimaryKey
  @Column({ type: DataTypes.STRING(21) })
  declare id: string;
  // Created at:
  @CreatedAt
  declare creationDate: Date;
  // Updated at:
  @UpdatedAt
  declare updateDate: Date;
  // Deleted at:
  @DeletedAt
  declare deletionDate: Date;

  // Username with validation:
  @Column({ type: DataTypes.STRING(10) })
  @NotNull
  @Unique
  @Index
  @Validate({ len: [3, 10] })
  declare username: string;

  // Email with validation:
  @Column({ type: DataTypes.STRING(50) })
  @NotNull
  @Unique
  @Index
  @Validate({ isEmail: true })
  declare email: string;

  // Password
  @Column({ type: DataTypes.STRING(255) })
  @NotNull
  declare password: string;

  // Functions:
  // Password validation method:
  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Hooks:
  // Hash user password before create
  @BeforeCreate
  static async hashPassword(instance: User) {
    const saltRounds = 10;
    instance.password = await bcrypt.hash(instance.password, saltRounds);
  }

  // Generate new nanoid before create
  @BeforeCreate
  static generateId(instance: User) {
    if (!instance.id) {
      instance.id = nanoid();
    }
  }
}

export default User;
