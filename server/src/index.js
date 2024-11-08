import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createServer } from "https";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { connectDatabase } from "./config/database.config.js";
import { router as authRouter } from "./routes/auth.route.js";
import { router as blogRouter } from "./routes/blog.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../keys");

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));

const options = {
  key: readFileSync(join(__dirname, "key.pem")),
  cert: readFileSync(join(__dirname, "cert.pem")),
};

connectDatabase();

app.use("/api", authRouter);
app.use("/api", blogRouter);

const { PORT } = process.env;

createServer(options, app).listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
