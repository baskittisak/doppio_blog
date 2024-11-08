import express from "express";
import request from "supertest";
import { router } from "../blog.route";

const mockBlog = {
  id: "1",
  title: "Test Blog",
  content: "A blog for testing",
};

const app = express();
app.use(express.json());
app.use("/api", router);

jest.mock("../../middleware/auth.middleware", () => ({
  authCheckToken: jest.fn((_, __, next) => next()),
}));

jest.mock("../../controllers/blog.controller", () => ({
  createBlog: jest.fn((_, res) => {
    return res
      .status(201)
      .json({ message: "Blog created", blog: mockBlog });
  }),
  deleteBlog: jest.fn((_, res) => res.status(200).send()),
  getAllBlog: jest.fn((_, res) => res.status(200).json([mockBlog])),
  getBlogById: jest.fn((req, res) => {
    if (req.params.id === mockBlog.id) {
      return res.status(200).json(mockBlog);
    }
    return res.status(404).json({ message: "Blog not found" });
  }),
  updateBlog: jest.fn((req, res) => {
    if (req.params.id === mockBlog.id) {
      return res.status(200).json({
        message: "Blog updated",
        blog: { ...mockBlog, ...req.body },
      });
    }
    return res.status(404).json({ message: "Blog not found" });
  }),
}));

describe("Blog Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a blog", async () => {
    const response = await request(app)
      .post("/api/blog")
      .send({
        title: "New Blog",
        content: "A new blog",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Blog created");
    expect(response.body.blog).toEqual(mockBlog);
  });

  it("should return 400 for invalid request body (missing fields)", async () => {
    const response = await request(app)
      .post("/api/blog")
      .send({ title: "New Blog" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("content: Required");
  });

  it("should get all blogs", async () => {
    const response = await request(app).get("/api/blogs");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockBlog]);
  });

  it("should get blog by ID", async () => {
    const response = await request(app).get("/api/blog/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBlog);
  });

  it("should return 404 for blog not found", async () => {
    const response = await request(app).get("/api/blog/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Blog not found");
  });

  it("should update a blog", async () => {
    const response = await request(app)
      .put("/api/blog/1")
      .send({
        title: "Updated Blog",
        content: "A updated blog",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog updated");
    expect(response.body.blog.title).toBe("Updated Blog");
  });

  it("should return 404 when updating a non-existing blog", async () => {
    const response = await request(app)
      .put("/api/blog/999")
      .send({
        title: "New Blog 999",
        content: "A new blog 999",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Blog not found");
  });

  it("should delete a blog", async () => {
    const response = await request(app).delete("/api/blog/1");

    expect(response.status).toBe(200);
  });
});
