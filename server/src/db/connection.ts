import path from "path";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
	database: "study_timer_db",
	dialect: "sqlite",
	username: "studytimer",
	password: "",
	storage: path.join(__dirname, "../../study_timer_db.sqlite"),
	models: [__dirname + "/**/*.model.*"],
	modelMatch: (filename, member) => {
		return (
			filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
		);
	},
});

export default sequelize;
