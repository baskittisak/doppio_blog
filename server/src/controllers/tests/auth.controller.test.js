import { register, login, logout } from "../../controllers/auth.controller.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { blacklist } from "../../middleware/auth.middleware.js";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../models/user.model.js");
jest.mock("../../middleware/auth.middleware", () => ({
  authCheckToken: jest.fn((_, __, next) => next()),
  blacklist: {
    add: jest.fn(),
  },
}));

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        username: "John Doppio",
        password: "password123",
        email: "john@example.com",
      };

      User.findOne.mockResolvedValue(null);

      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed_password");

      User.prototype.save.mockResolvedValue(true);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });

    it("should return 409 if user already exists", async () => {
      req.body = {
        username: "John Doppio",
        password: "password123",
        email: "john@example.com",
      };

      User.findOne.mockResolvedValue({
        username: "John Doppio",
        email: "john@example.com",
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should handle errors", async () => {
      req.body = {
        username: "John Doppio",
        password: "password123",
        email: "john@example.com",
      };
      User.findOne.mockRejectedValue(new Error("Database error"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("login", () => {
    it("should login successfully and return a token", async () => {
      req.body = { username: "John Doppio", password: "password123" };

      User.findOne.mockResolvedValue({
        username: "John Doppio",
        password: "hashed_password",
      });

      bcrypt.compare.mockResolvedValue(true);

      jwt.sign.mockImplementation((_, __, callback) => {
        callback(null, "Mock token");
      });

      process.env.SECRET_KEY = "SECRET_KEY";

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: "Mock token",
        message: "User login successfully",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      req.body = { username: "John Doppio", password: "wrong_password" };

      User.findOne.mockResolvedValue({
        username: "John Doppio",
        password: "hashed_password",
      });

      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid username or password",
      });
    });

    it("should return 404 if user is not found", async () => {
      req.body = { username: "John Doppio", password: "password123" };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors", async () => {
      req.body = { username: "John Doppio", password: "password123" };
      User.findOne.mockRejectedValue(new Error("Database error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      req.headers = { authorization: "Bearer Mock token" };

      blacklist.add.mockResolvedValue(true);

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logout successfully",
      });
    });

    it("should return 401 if no token is provided", async () => {
      req.headers = {};

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "No token provided, authorization denied",
      });
    });
  });
});
