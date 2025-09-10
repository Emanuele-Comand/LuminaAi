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

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
