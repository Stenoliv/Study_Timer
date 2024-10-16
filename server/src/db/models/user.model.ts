import { nanoid } from "nanoid";
import { DataTypes, Optional } from "sequelize";
import {
  BeforeCreate,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
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
export class User extends Model<UserAttributes, UserCreationAttributes> {
  // ID of type nanoid
  @Unique
  @PrimaryKey
  @Column({ type: DataTypes.STRING(21) })
  declare id: string;
  // Created at:
  @CreatedAt
  declare createdAt: Date;
  // Updated at:
  @UpdatedAt
  declare updatedAt: Date;
  // Deleted at:
  @DeletedAt
  declare deletedAt: Date;

  // Username with validation:
  @NotNull
  @Unique
  @Index
  @Validate({ len: [3, 10] })
  @Column({ type: DataTypes.STRING(10), allowNull: false })
  declare username: string;

  // Email with validation:
  @NotNull
  @Unique
  @Index
  @Validate({ isEmail: true })
  @Column({ type: DataTypes.STRING(50), allowNull: false })
  declare email: string;

  // Password
  @NotNull
  @Column({ type: DataTypes.STRING(255), allowNull: false })
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
      console.log("Generating ID");
      // Check if id is undefined or null
      instance.id = nanoid();
    }
  }

  // Associations:
}
