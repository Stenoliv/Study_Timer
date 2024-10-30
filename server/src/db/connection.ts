import path from "path";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
	database: "study_timer_db",
	dialect: "sqlite",
	username: "studytimer",
	password: "",
	storage: path.join(__dirname, "../../study_timer_db.sqlite"),
	models: [__dirname + "/**/*.model.ts"],
	modelMatch: (filename, member) => {
		return (
			filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
		);
	},
});

export const testDB = (name: string) =>
	new Sequelize({
		database: name,
		dialect: "sqlite",
		username: "studytimer",
		password: "",
		storage: ":memory:",
		models: [__dirname + "/**/*.model.ts"],
		modelMatch: (filename, member) => {
			return (
				filename.substring(0, filename.indexOf(".model")) ===
				member.toLowerCase()
			);
		},
		logging: false,
	});

export default sequelize;
