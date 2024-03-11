import express from "express";
import { request, response } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";

const app = express();
dotenv.config();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
