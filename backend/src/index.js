import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import createChatRouter from "./routes/chat.js";
import { Ollama } from "ollama";
import pool, { testConnection } from "./config/database.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRouter);

const client = new Ollama({ host: "http://ollama:11434" });

app.use("/api", createChatRouter(client));

app.get("/health", (req, res) => {
  console.log("Health check received");
  res.json({ ok: true, time: new Date().toISOString() });
});

testConnection().then((success) => {
  if (success) {
    console.log("Database connection successful ✅");
  } else {
    console.log("Database connection failed ❌");
  }
});

app.listen(4000, () => console.log("Server listening on port:4000"));
