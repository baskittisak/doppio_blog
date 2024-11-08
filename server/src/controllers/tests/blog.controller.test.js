import {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUsername,
} from "../../controllers/blog.controller.js";
import Blog from "../../models/blog.model.js";
import jwt from "jsonwebtoken";

jest.mock("../../models/blog.model.js");
jest.mock("jsonwebtoken");

describe("Blog Controller", () => {
  let request, response;

  beforeEach(() => {
    request = {
      headers: { authorization: `Bearer Mock Token` },
      body: {},
      params: {},
    };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBlog", () => {
    it("should create a blog and return 201 status", async () => {
      Blog.prototype.save.mockResolvedValue({});

      jwt.decode.mockReturnValue({ username: "username" });
      request.body = { title: "Test Blog", content: "Test Content" };

      await createBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: "Blog created successfully",
      });
    });

    it("should handle errors and return 500", async () => {
      Blog.prototype.save.mockRejectedValue(new Error("Database error"));

      request.body = { title: "Test Blog", content: "Test Content" };

      await createBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getAllBlog", () => {
    it("should return all blogs with 200 status", async () => {
      const mockBlogs = [
        {
          _id: "1",
          title: "Blog 1",
          content: "Content 1",
          toObject: jest.fn().mockReturnValue({
            _id: "1",
            title: "Blog 1",
            content: "Content 1",
          }),
        },
        {
          _id: "2",
          title: "Blog 2",
          content: "Content 2",
          toObject: jest.fn().mockReturnValue({
            _id: "2",
            title: "Blog 2",
            content: "Content 2",
          }),
        },
      ];

      Blog.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBlogs),
      });

      await getAllBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: [
          { id: "1", title: "Blog 1", content: "Content 1" },
          { id: "2", title: "Blog 2", content: "Content 2" },
        ],
        message: "Blog retrieved successfully",
      });
    });

    it("should return 500 if there is a database error", async () => {
      Blog.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await getAllBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getBlogById", () => {
    it("should return the blog by ID with 200 status", async () => {
      const mockBlog = {
        _id: "1",
        title: "Blog 1",
        content: "Content 1",
        toObject: jest.fn().mockReturnValue({
          _id: "1",
          title: "Blog 1",
          content: "Content 1",
        }),
      };
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBlog),
      });

      await getBlogById(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: { id: "1", title: "Blog 1", content: "Content 1" },
        message: "Blog retrieved successfully",
      });
    });

    it("should return 404 if blog is not found", async () => {
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await getBlogById(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ message: "Blog not found" });
    });

    it("should return 500 if there is a database error", async () => {
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await getBlogById(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("updateBlog", () => {
    it("should update the blog and return 200 status", async () => {
      const mockBlog = {
        _id: "1",
        title: "Old Title",
        content: "Old Content",
      };
      request.params.id = "1";
      request.body = {
        title: "Updated Title",
        content: "Updated Content",
        createdBy: "username",
        updatedBy: "username",
      };

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBlog),
      });

      Blog.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockBlog, ...request.body }),
      });

      await updateBlog(request, response);

      expect(Blog.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "1" },
        request.body,
        { new: true }
      );
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: "Blog updated successfully",
      });
    });

    it("should return 404 if blog is not found", async () => {
      request.params.id = "1";
      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await updateBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ message: "Blog not found" });
    });

    it("should return 500 if there is a database error", async () => {
      request.params.id = "1";
      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await updateBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("deleteBlog", () => {
    it("should delete the blog and return 200 status", async () => {
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: "1",
          title: "Blog 1",
          content: "Content 1",
        }),
      });

      Blog.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      await deleteBlog(request, response);

      expect(Blog.findOneAndDelete).toHaveBeenCalledWith({ _id: "1" });
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: "Blog deleted successfully",
      });
    });

    it("should return 404 if blog is not found", async () => {
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await deleteBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ message: "Blog not found" });
    });

    it("should return 500 if there is a database error", async () => {
      request.params.id = "1";

      Blog.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await deleteBlog(request, response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getUsername", () => {
    it("should return the username when a valid JWT token is provided", () => {
      const req = {
        headers: {
          authorization: "Bearer Mock Token",
        },
      };
      const mockDecode = jest
        .spyOn(jwt, "decode")
        .mockReturnValue({ username: "testuser" });
      const result = getUsername(req);
      expect(result).toBe("testuser");
      mockDecode.mockRestore();
    });
  });
});
