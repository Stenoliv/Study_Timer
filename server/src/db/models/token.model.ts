import { DataTypes, Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	CreatedAt,
	Default,
	ForeignKey,
	Index,
	Model,
	NotNull,
	Table,
	Unique,
	UpdatedAt,
} from "sequelize-typescript";
import { User } from "./user.model";

// Token attributes
export interface TokenAttributes {
	userId: string;
	jti: string;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date;
}

// Token creation attributes
export interface TokenCreationAttributes
	extends Optional<TokenAttributes, "createdAt" | "updatedAt"> {}

// Token class to store refresh tokens
@Table({ timestamps: true })
export class Token extends Model<TokenAttributes, TokenCreationAttributes> {
	// CreatedAt:
	@CreatedAt
	declare createdAt: Date;

	// UpdatedAt:
	@UpdatedAt
	declare updatedAt: Date;

	// UserID
	@ForeignKey(() => User)
	@Index("idx_token")
	@Column({
		type: DataTypes.STRING(21),
		allowNull: false,
		onUpdate: "RESTRICT",
		onDelete: "CASCADE",
	})
	declare userId: string;

	// Belongs to user
	@BelongsTo(() => User)
	declare user: User;

	// Refresh token jti
	@Unique
	@Index("idx_token")
	@Column({ type: DataTypes.STRING(21), allowNull: false })
	declare jti: string;

	// ExpiresAt
	@Column({ type: DataTypes.DATE, allowNull: false })
	declare expiresAt: Date;

	// Functions
	invalidateTokens = async () => {};
}
