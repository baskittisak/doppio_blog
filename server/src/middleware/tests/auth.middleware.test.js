import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { authCheckToken } from "../auth.middleware";

const app = express();
app.use(express.json());

app.get("/api/protected", authCheckToken, (_, res) => {
  res.status(200).json({ message: "Access granted" });
});

describe("authCheckToken Middleware", () => {
  const SECRET_KEY = "test_secret_key";

  beforeAll(() => {
    process.env.SECRET_KEY = SECRET_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should grant access with a valid token", async () => {
    const token = jwt.sign({ id: "test_user" }, SECRET_KEY);

    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted");
  });

  it("should deny access when no token is provided", async () => {
    const response = await request(app).get("/api/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "No token provided, authorization denied"
    );
  });

  it("should deny access with an invalid token", async () => {
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer invalid_token`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Token is expired");
  });

  it("should handle missing SECRET_KEY", async () => {
    delete process.env.SECRET_KEY;

    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer invalid_token`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Internal server error: Missing SECRET_KEY"
    );
  });
});
