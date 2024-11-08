import Blog from "../models/blog.model.js";
import jwt from "jsonwebtoken";

export const getUsername = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { username } = jwt.decode(token);
  return username;
};

export const createBlog = async (req, res) => {
  try {
    await new Blog({
      ...req.body,
      createdBy: getUsername(req),
      updatedBy: getUsername(req),
    }).save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const allBlogs = await Blog.find({ createdBy: getUsername(req) }).exec();
    const blogs = allBlogs.map((blog) => ({
      ...blog.toObject(),
      id: blog._id,
      _id: undefined,
    }));
    res
      .status(200)
      .json({ data: blogs, message: "Blog retrieved successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({
      _id: id,
    }).exec();

    if (blog) {
      const formattedBlog = {
        id: blog._id.toString(),
        ...blog.toObject(),
        _id: undefined,
      };

      res.status(200).json({
        data: formattedBlog,
        message: "Blog retrieved successfully",
      });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id }).exec();

    if (blog) {
      const body = {
        ...req.body,
        createdBy: getUsername(req),
        updatedBy: getUsername(req),
      };

      await Blog.findOneAndUpdate({ _id: id }, body, {
        new: true,
      }).exec();

      res.status(200).json({
        message: "Blog updated successfully",
      });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id }).exec();

    if (blog) {
      await Blog.findOneAndDelete({ _id: id }).exec();

      res.status(200).json({
        message: "Blog deleted successfully",
      });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
