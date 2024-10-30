import { DataTypes, Optional } from "sequelize";
import {
	BeforeCreate,
	BelongsTo,
	Column,
	CreatedAt,
	ForeignKey,
	Model,
	NonBelongsToManyAssociationOptions,
	NotNull,
	PrimaryKey,
	Table,
	Unique,
	UpdatedAt,
} from "sequelize-typescript";
import { User } from "./user.model";
import { nanoid } from "nanoid";

export interface SessionAttribute {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	name: string;
	time: number;
}

export interface SessionCreationAttribute
	extends Optional<SessionAttribute, "id" | "createdAt" | "updatedAt"> {}

@Table({ timestamps: true })
export class Session extends Model<SessionAttribute, SessionCreationAttribute> {
	// Primary key
	@PrimaryKey
	@Unique
	@Column({ type: DataTypes.STRING(21) })
	declare id: string;

	// Created at field:
	@CreatedAt
	declare createdAt: Date;

	// Updated at field:
	@UpdatedAt
	declare updatedAt: Date;

	// Foreign key to user:
	@ForeignKey(() => User)
	@Column({
		type: DataTypes.STRING(21),
		allowNull: false,
		onUpdate: "RESTRICT",
		onDelete: "CASCADE",
	})
	declare userId: string;

	// Belongs to user:
	@BelongsTo(() => User)
	declare user: User;

	// Name of study session:
	@Column({ type: DataTypes.STRING(255), allowNull: false })
	declare name: string;

	// Total time of study session:
	@Column({ type: DataTypes.INTEGER, allowNull: false })
	declare time: number;

	// Hooks:
	// Generate ID:
	@BeforeCreate
	static generateID = (instance: Session) => {
		if (!instance.id) {
			instance.id = nanoid();
		}
	};
}
