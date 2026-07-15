import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env, isTestEnv } from "../env.ts";
import morgan from "morgan";
import { registeration } from "./modules/auth/authController.ts";

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

app.use("/api/v1/auth", registeration);

export { app };
export default app;
