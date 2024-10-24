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
import { Session } from "./session.model";
import { Token } from "./token.model";

export interface UserAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

@Table({
  timestamps: true,
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

  public toJSON() {
    const { password, ...userData } = this.get();
    return userData;
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
      // Check if id is undefined or null
      instance.id = nanoid();
    }
  }

  // Associations:
  @HasMany(() => Session)
  declare sessions: Session[];

  @HasMany(() => Token)
  declare tokens: Token[];
}
