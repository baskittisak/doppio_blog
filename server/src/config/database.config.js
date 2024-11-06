import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) throw "Internal server error: Missing MONGODB_URI";

    await mongoose.connect(MONGODB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
};
