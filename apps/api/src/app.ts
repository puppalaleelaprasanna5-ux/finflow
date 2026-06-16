import cors from "cors";
import express, { Application } from "express";
import apiRouter from "./routes/api";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;
