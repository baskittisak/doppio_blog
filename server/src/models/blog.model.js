import mongoose from "mongoose";
import { z } from "zod";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 100,
    },
    content: {
      type: String,
      maxlength: 2000,
    },
    createdBy: String,
    updatedBy: String,
  },
  { versionKey: false }
);

export default mongoose.model("blogs", blogSchema);

export const typeBlog = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(2000),
});
