import cors from "cors";
import express, { Application } from "express";
import path from "path";
import fs from "fs";
import apiRouter from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/uploads", express.static(uploadsDir));

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;
