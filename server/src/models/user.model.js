import mongoose from "mongoose";
import { z } from "zod";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  { versionKey: false }
);

export default mongoose.model("users", userSchema);

export const typeUser = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  email: z.string().email("Invalid email address").optional(),
});
