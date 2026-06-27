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

const allowedOrigins = [
  "http://localhost:3000",
  "https://finflow-five-lyart.vercel.app",
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use("/uploads", express.static(uploadsDir));

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;
