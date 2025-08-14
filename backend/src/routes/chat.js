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

  // Streaming
  router.get("/stream", async (req, res) => {
    if (!pendingMessages || pendingMessages.length === 0) {
      res.status(400).json({ error: "No messages to process" });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders?.();

    try {
      const response = await client.chat({
        model: "phi3:mini",
        messages: pendingMessages,
        stream: true,
      });

      for await (const chunk of response) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write("event: done\ndata: {}\n\n");
      res.end();
    } catch (err) {
      console.error("Stream error:", err);
      res.status(500).end();
    }
  });

  return router;
}

export default createChatRouter;
