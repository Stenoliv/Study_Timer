import request from "supertest";
import { Session } from "@/db/models/session.model";
import { Model } from "sequelize";
import app from "@/app";

jest.mock("@/db/models/session.model");
const mockedSession = Session as jest.Mocked<typeof Session>;

let authToken: string;
let userId: string;
interface SessionAttributes {
  id: string;
  userId: string;
  time: number;
}

// Type the mock as a Model instance with these attributes
type MockSessionModel = Model<SessionAttributes> & SessionAttributes;
describe("Session Controllers", () => {
  beforeAll(async () => {
    // Login and store the token before running tests
    const response = await request(app).post("/api/auth/signin").send({
      email: "test@test.test",
      password: "pw123456",
    });

    authToken = response.body.tokens.access;
    userId = response.body.user.id;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test getSessionStatsController
  describe("GET /api/sessions/stats", () => {
    it("should return session stats for authenticated user", async () => {
      mockedSession.findAll.mockResolvedValueOnce([]);

      const response = await request(app)
        .get("/api/sessions/stats")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body.todaysMinutes).toBe(270);
    });

    it("should return 401 for unauthenticated user", async () => {
      const response = await request(app).get("/api/sessions/stats");
      expect(response.status).toBe(401);
      expect(response.body.error).toBe(
        "Not authenticated: Couldn't get authentication state"
      );
    });
  });

  // Test createSessionController
  describe("POST /api/sessions", () => {
    it("should create a session for authenticated user", async () => {
      mockedSession.create.mockResolvedValue({
        id: "newSessionId",
        userId,
        name: "Test Session",
        time: 120,
      });

      const response = await request(app)
        .post("/api/sessions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Test Session", time: 120 });

      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
    });
  });

  // Test getSessionController
  describe("GET /api/sessions/:id", () => {
    it("should return session for authenticated user", async () => {
      mockedSession.findOne.mockResolvedValueOnce({
        id: "sessionId",
        userId,
        time: 120,
      } as MockSessionModel);

      const response = await request(app)
        .get("/api/sessions/sessionId")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
    });
  });
});
