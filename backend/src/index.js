import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import ollama from "ollama";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  console.log("Health check received");
  res.json({ ok: true, time: new Date().toISOString() });
});

// Se Ollama gira altrove, puoi comunque esportare OLLAMA_HOST via env.
// La libreria di norma punta all'host/porta locali di default (11434).
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
// Nota: la libreria usa internamente il suo default; se serve un host custom
// potresti dover usare una variabile d'ambiente supportata dalla lib o chiamare
// direttamente l'HTTP endpoint di Ollama. Qui usiamo l'API ufficiale:
app.post("/api/chat", async (req, res) => {
  const { messages, model = "deepseek-r1" } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'messages' array" });
  }

  try {
    // Usa l'export principale: ollama.chat(...)
    const response = await ollama.chat({ model, messages });
    return res.json(response);
  } catch (err) {
    console.error("Ollama error:", err);
    return res.status(502).json({
      error: "Errore nel chiamare Ollama",
      details: err?.message || String(err),
    });
  }
});

app.listen(4000, () => console.log("Server listening on port:4000"));
