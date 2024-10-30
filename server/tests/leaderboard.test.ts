import app from "@/app";
import { testDB } from "@/db/connection";
import { time } from "console";
import { Sequelize } from "sequelize";
import request from "supertest";

beforeAll(async () => {
	sequelize = testDB("test_db_leaderboard");
	await sequelize.authenticate();
	await sequelize.sync({ force: true });

	let res = await request(app).post("/auth/signup").send({
		username: "test",
		email: "test@test.test",
		password: "pw123456",
	});
	expect(res.status).toBe(201);
	authToken = res.body.tokens.access;
	res = await request(app)
		.post("/sessions")
		.set("Authorization", `Bearer ${authToken}`)
		.send({
			name: "Test",
			time: 20,
		});
	res = await request(app).post("/auth/signup").send({
		username: "test2",
		email: "test@test2.test",
		password: "pw123456",
	});
	expect(res.status).toBe(201);
	authToken = res.body.tokens.access;
	res = await request(app)
		.post("/sessions")
		.set("Authorization", `Bearer ${authToken}`)
		.send({
			name: "Test",
			time: 40,
		});
});

afterAll(async () => {
	await sequelize.close();
});

let sequelize: Sequelize;
let authToken: string;

// Get leaderboard without authentication
describe("Get /leaderboards", () => {
	it("Should return first page of leaderboard", async () => {
		const res = await request(app).get("/leaderboard?page=1");

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("leaderboard");
		expect(res.body.leaderboard).toHaveLength(2);
	});

	it("Should return second page of leaderboard", async () => {
		const res = await request(app).get("/leaderboard?page=2");

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("leaderboard");
		expect(res.body.leaderboard).toHaveLength(0);
	});
});
