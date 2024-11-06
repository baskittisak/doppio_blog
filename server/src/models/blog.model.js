import mongoose from "mongoose";
import { z } from "zod";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { versionKey: false }
);

export default mongoose.model("blogs", blogSchema);

export const typeBlog = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});
