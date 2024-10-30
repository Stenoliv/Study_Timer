import { testDB } from "@/db/connection";
import app from "../src/app";
import request from "supertest";
import { Sequelize } from "sequelize";

beforeAll(async () => {
	sequelize = testDB("test_db_auth");
	await sequelize.authenticate();
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

let sequelize: Sequelize;
const password = "password123";

// Test POST /auth/signup
describe("POST /auth/signup", () => {
	// Test that can sign in
	it("Should return user data upon successfull signup", async () => {
		const res = await request(app).post("/auth/signup").send({
			username: "TestUser",
			email: "test@example.com",
			password: password,
		});

		// Now expect results
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("user");
		expect(res.body.user).toHaveProperty("email", "test@example.com");
		expect(res.body.user).not.toHaveProperty("password");
	});

	// Test that can't set too long username
	it("Shouldn't return user data since to long username", async () => {
		const res = await request(app).post("/auth/signup").send({
			username: "12345678910",
			email: "test@example2.com",
			password: password,
		});

		expect(res.status).toBe(400);
		expect(res.body).not.toHaveProperty("user");
		expect(res.body).not.toHaveProperty("tokens");
	});

	// Test that email needs to follow email struct
	it("Shouldn't return user data, because faulty Email: test.com", async () => {
		const res = await request(app).post("/auth/signup").send({
			username: "TestUser2",
			email: "test.com",
			password: password,
		});

		expect(res.status).toBe(400);
		expect(res.body).not.toHaveProperty("user");
		expect(res.body).not.toHaveProperty("tokens");
	});
});

// Test POST /auth/signin
describe("POST /auth/signin", () => {
	// Test that can sign in with newly created user
	it("should return user", async () => {
		const res = await request(app).post("/auth/signin").send({
			email: "test@example.com",
			password: password,
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("user");
		expect(res.body).toHaveProperty("tokens");
		expect(res.body.user).toHaveProperty("username", "TestUser");
		expect(res.body.user).toHaveProperty("email", "test@example.com");
		expect(res.body.user).not.toHaveProperty("password");
	});

	// Check that can't login with non excisting users
	it("Shouldn't return user", async () => {
		const res = await request(app).post("/auth/signin").send({
			email: "test2@example.com",
			password: password,
		});

		expect(res.status).toBe(400);
		expect(res.body).not.toHaveProperty("user");
		expect(res.body).not.toHaveProperty("tokens");
	});
});
