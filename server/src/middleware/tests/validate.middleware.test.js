import express from "express";
import request from "supertest";
import { validateBodyRequest } from "../validate.middleware";
import { typeUser } from "../../models/user.model";
import { ZodSchema } from "zod";

const app = express();
app.use(express.json());

app.post("/test", validateBodyRequest(typeUser), (_, res) => {
  res.status(200).json({ message: "Validation passed!" });
});

describe("validateBodyRequest Middleware", () => {
  it("should return 400 for invalid request body (missing username)", async () => {
    const response = await request(app)
      .post("/test")
      .send({ password: "valid_password" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("username: Required");
  });

  it("should return 400 for invalid request body (missing password)", async () => {
    const response = await request(app)
      .post("/test")
      .send({ username: "valid_username" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("password: Required");
  });

  it("should return 400 for invalid request body (short password)", async () => {
    const response = await request(app)
      .post("/test")
      .send({ username: "valid_username", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "password: Password must be at least 8 characters long"
    );
  });

  it("should return 200 for valid request body", async () => {
    const response = await request(app)
      .post("/test")
      .send({ username: "valid_username", password: "valid_password" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Validation passed!");
  });

  it("should call next function when request body is valid", () => {
    const schema = {
      parse: jest.fn().mockImplementation(() => true),
    };
    const req = { body: { name: "John Doppio" } };
    const res = {};
    const next = jest.fn();

    const middleware = validateBodyRequest(schema);

    middleware(req, res, next);

    expect(schema.parse).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
  });

  it("should call next with an error if validation throws an unexpected error", async () => {
    const invalidSchema = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error("Unexpected error");
      }),
    };
    const mockNext = jest.fn();

    const middleware = validateBodyRequest(invalidSchema);

    const req = { body: {} };
    const res = {};

    middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
