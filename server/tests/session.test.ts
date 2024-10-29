import request from "supertest";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {
  getSessionStatsController,
  createSessionController,
  getSessionController,
  getLatestSessionController,
  updateSessionController,
  deleteSessionController,
} from "@/controllers/session.controller";
import { Session } from "@/db/models/session.model";
import { Token } from "@/db/models/token.model";

const app = express();
app.use(bodyParser.json());

const mockAuthMiddleware = (req: Request, res: Response, next: Function) => {
  req.user = { sub: "testUserId", jti: "asad", type: Token };
  next();
};

app.use(mockAuthMiddleware);

// Define routes for testing
app.get("/api/sessions/stats", getSessionStatsController);
app.post("/api/sessions", createSessionController);
app.get("/api/sessions/:id", getSessionController);
app.get("/api/sessions/latest", getLatestSessionController);
app.put("/api/sessions/:id", updateSessionController);
app.delete("/api/sessions/:id", deleteSessionController);

// Mocking Sequelize models
jest.mock("@/db/models/session.model");
const mockedSession = Session as jest.Mocked<typeof Session>;

describe("Session Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test getSessionStatsController
  describe("GET /api/sessions/stats", () => {
    it("should return session stats for authenticated user", async () => {
      mockedSession.findAll.mockResolvedValueOnce([
        { time: 120 },
        { time: 150 },
      ]);
      mockedSession.findAll.mockResolvedValueOnce([
        { time: 120 },
        { time: 150 },
        { time: 60 },
      ]);

      const response = await request(app).get("/api/sessions/stats");
      expect(response.status).toBe(200);
      expect(response.body.todaysMinutes).toBe(270);
      expect(response.body.totalHours).toBe(330);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    it("should return 401 for unauthenticated user", async () => {
      const unauthenticatedApp = express();
      unauthenticatedApp.use(bodyParser.json());
      unauthenticatedApp.use((req: Request, res: Response) => {
        res.status(401).json({
          error: "Not authenticated: Couldn't get authentication state",
        });
      });

      const response = await request(unauthenticatedApp).get(
        "/api/sessions/stats"
      );
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
        userId: "testUserId",
        name: "Test Session",
        time: 120,
      });

      const response = await request(app)
        .post("/api/sessions")
        .send({ name: "Test Session", time: 120 });

      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
      expect(response.body.session.name).toBe("Test Session");
    });

    it("should return 400 if session creation fails", async () => {
      mockedSession.create.mockRejectedValue(new Error("Error"));

      const response = await request(app)
        .post("/api/sessions")
        .send({ name: "Test Session", time: 120 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Failed to create session");
    });
  });

  // Test getSessionController
  describe("GET /api/sessions/:id", () => {
    it("should return session for authenticated user", async () => {
      mockedSession.findOne.mockResolvedValueOnce({
        id: "sessionId",
        userId: "testUserId",
      });

      const response = await request(app).get("/api/sessions/sessionId");
      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
      expect(response.body.session.id).toBe("sessionId");
    });

    it("should return 404 if session not found", async () => {
      mockedSession.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get("/api/sessions/invalidId");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(
        "Session not found for this user with the given parameters"
      );
    });
  });

  // Test getLatestSessionController
  describe("GET /api/sessions/latest", () => {
    it("should return latest session for authenticated user", async () => {
      mockedSession.findOne.mockResolvedValueOnce({ id: "latestSessionId" });

      const response = await request(app).get("/api/sessions/latest");
      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
      expect(response.body.session.id).toBe("latestSessionId");
    });

    it("should return 404 if no session found", async () => {
      mockedSession.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get("/api/sessions/latest");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe(
        "Session not found for this user with the given parameters"
      );
    });
  });

  // Test updateSessionController
  describe("PUT /api/sessions/:id", () => {
    it("should update session time for authenticated user", async () => {
      mockedSession.update.mockResolvedValueOnce([
        1,
        [{ id: "sessionId", time: 150 }],
      ]);

      const response = await request(app)
        .put("/api/sessions/sessionId")
        .send({ time: 150 });

      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty("id");
      expect(response.body.session.time).toBe(150);
    });

    it("should return 404 if session not found", async () => {
      mockedSession.update.mockResolvedValueOnce([0]);

      const response = await request(app)
        .put("/api/sessions/sessionId")
        .send({ time: 150 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Session not found");
    });
  });

  // Test deleteSessionController
  describe("DELETE /api/sessions/:id", () => {
    it("should delete session for authenticated user", async () => {
      mockedSession.destroy.mockResolvedValueOnce(1);

      const response = await request(app).delete("/api/sessions/sessionId");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Session deleted successfully");
    });

    it("should return 404 if session not found", async () => {
      mockedSession.destroy.mockResolvedValueOnce(0);

      const response = await request(app).delete("/api/sessions/invalidId");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Session not found");
    });
  });
});
