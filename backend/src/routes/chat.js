import express from "express";

function createChatRouter(client, opts = {}) {
  const router = express.Router();

  // POST /api/chat
  // body: { messages: [{ role: 'user'|'assistant'|'system', content: '...' }, ...], model?: 'model-name' }

  let pendingMessages = []; // Saving last message, TODO: Implement db

  router.post("/send", (req, res) => {
    const { messages } = req.body;
    pendingMessages = messages;
    res.json({ status: "ok" });
  });

  router.get("/stream", async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders?.();

    try {
      for await (const chunk of client.chatStream({
        model: "phi3:mini",
        messages: pendingMessages,
      })) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write("event: done\ndata: {}\n\n");
      res.end();
    } catch (err) {
      console.error("Stream error:", err);
    }
  });

  // Streaming
  router.post("/stream", async (req, res) => {
    const { messages, model } = req.body;
    if (!Array.isArray(messages))
      return res.status(400).json({ error: "messages array required" });

    const modelName = model || opts.defaultModel || "phi3:mini";

    //Streaming header
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders?.();

    //Streaming logics
    try {
      for await (const chunk of client.chatStream({
        model: modelName,
        messages,
      })) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write("event: done\ndata: {}\n\n");
      res.end();
    } catch (err) {
      console.error("Stream error:", err);
    }
  });

  return router;
}

export default createChatRouter;
