import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env, isTestEnv } from "../env.ts";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    skip: () => isTestEnv(),
  }),
);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", timestamp: new Date(), service: "E-Commerce API" });
});

export { app };
export default app;
