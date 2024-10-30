import request from "supertest";
import app from "@/app";
import { testDB } from "@/db/connection";
import { Sequelize } from "sequelize";

let userId: string;
let authToken: string;
let sessionId: string;

beforeAll(async () => {
	sequelize = testDB("test_db_session");
	await sequelize.authenticate();
	await sequelize.sync({ force: true });

	const response = await request(app).post("/auth/signup").send({
		username: "test",
		email: "test@test.test",
		password: "pw123456",
	});

	expect(response.status).toBe(201);
	userId = response.body.user.id;
});

afterAll(async () => {
	await sequelize.close();
});

let sequelize: Sequelize;

// Sign in user before each
beforeEach(async () => {
	// Login and store the token before running tests
	const response = await request(app).post("/auth/signin").send({
		email: "test@test.test",
		password: "pw123456",
	});

	expect(response.status).toBe(200);
	authToken = response.body.tokens.access;
});

// test createSessionController
describe("POST /sessions", () => {
	// Create session unsuccesfully
	it("should create a session for authenticated user", async () => {
		const response = await request(app)
			.post("/sessions")
			.set("Authorization", `Bearer ${authToken}`)
			.send({ name: "Test Session", time: 120 });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("session");
		expect(response.body.session).toHaveProperty("id");
		expect(response.body.session).toHaveProperty("time");
		expect(response.body.session.time).toBe(120);
		sessionId = response.body.session.id; // Store id
	});

	// Create session unsuccesfully
	it("shouldn't create a session for authenticated user with invalid input", async () => {
		const res = await request(app)
			.post("/sessions")
			.set("Authorization", `Bearer ${authToken}`)
			.send({ name: 2, time: "test" });

		expect(res.status).toBe(400);
		expect(res.body).not.toHaveProperty("session");
		expect(res.body.error).toBe("Invalid input types");
	});

	// Create session unsuccesfully
	it("shouldn't create a session for a unauthenticated user", async () => {
		const res = await request(app)
			.post("/sessions")
			.send({ name: "Test", time: 20 });

		expect(res.status).toBe(401);
		expect(res.body).not.toHaveProperty("session");
		expect(res.body.error).toBe("Not authenticated: No token provided");
	});
});

// Test getSessionController
describe("GET /sessions/:id", () => {
	it("should return session for authenticated user", async () => {
		const response = await request(app)
			.get(`/sessions/${sessionId}`)
			.set("Authorization", `Bearer ${authToken}`);
		expect(response.status).toBe(200);
		expect(response.body.session).toHaveProperty("id");
		expect(response.body.session).toHaveProperty("time");
		expect(response.body.session.time).toBe(120);
	});
});

// Test getSessionStatsController
describe("GET /sessions/stats", () => {
	it("should return session stats for authenticated user", async () => {
		const response = await request(app)
			.get("/sessions/stats")
			.set("Authorization", `Bearer ${authToken}`);
		expect(response.status).toBe(200);
		expect(response.body.todaysMinutes).toBe(120);
	});

	it("should return 401 for unauthenticated user", async () => {
		const response = await request(app).get("/sessions/stats");
		expect(response.status).toBe(401);
		expect(response.body.error).toBe("Not authenticated: No token provided");
	});
});
