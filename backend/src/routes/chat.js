// server/src/routes/chat.js
import express from "express";

function createChatRouter(client, opts = {}) {
  const router = express.Router();

  // POST /api/chat
  // body: { messages: [{ role: 'user'|'assistant'|'system', content: '...' }, ...], model?: 'model-name' }
  router.post("/", async (req, res) => {
    const { messages, model } = req.body;

    // Validazione semplice
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'messages' array." });
    }
    for (const m of messages) {
      if (!m || typeof m.role !== "string" || typeof m.content !== "string") {
        return res.status(400).json({
          error:
            "Each message must be an object with string properties 'role' and 'content'.",
        });
      }
    }

    const modelName = model || opts.defaultModel || "deepseek-r1";

    try {
      // Chiamata sincronizzata (non-streaming)
      const response = await client.chat({ model: modelName, messages });
      return res.json(response);
    } catch (err) {
      console.error("Error calling Ollama:", err);
      // 502 Bad Gateway è appropriato per errori da upstream (il modello)
      return res
        .status(502)
        .json({
          error: "Errore nel chiamare il modello",
          details: err.message || err,
        });
    }
  });

  /**
   * OPTIONAL: endpoint SSE per streaming token-by-token
   * Nota: l'implementazione esatta dipende dall'SDK/vers. di ollama che stai usando.
   * Se l'SDK supporta un async iterator o callback per chunk, inoltra i chunk al client SSE.
   *
   * Esempio generico (potrebbe richiedere adattamenti):
   */
  router.post("/stream", async (req, res) => {
    const { messages, model } = req.body;
    if (!Array.isArray(messages))
      return res.status(400).json({ error: "messages array required" });

    const modelName = model || opts.defaultModel || "deepseek-r1";

    // Headers per Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders?.();

    // Nota: qui sotto è pseudocodice generico. Alcune versioni di ollama-js
    // forniscono un stream/iterator o callback che puoi usare per leggere chunk.
    // Adatta in base alla tua SDK version.
    try {
      // Esempio: se client.chat supportasse { stream: true } e restituisse un async iterator:
      // for await (const chunk of client.chatStream({ model: modelName, messages })) {
      //   res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      // }
      // res.write("event: done\ndata: {}\n\n");
      //
      // Poiché l'API del client può variare, qui chiudiamo la connessione subito
      // e usiamo la chiamata non-streaming per inviare la risposta completa:

      const fullResponse = await client.chat({ model: modelName, messages });
      res.write(`data: ${JSON.stringify(fullResponse)}\n\n`);
      res.write("event: done\ndata: {}\n\n");
      res.end();
    } catch (err) {
      console.error("Streaming error:", err);
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: err.message || err })}\n\n`
      );
      res.end();
    }
  });

  return router;
}

export default createChatRouter;
