import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import createChatRouter from "./routes/chat.js";
import { Ollama } from "ollama";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const client = new Ollama({ host: "http://ollama:11434" });

app.use("/api", createChatRouter(client));

app.get("/health", (req, res) => {
  console.log("Health check received");
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(4000, () => console.log("Server listening on port:4000"));
