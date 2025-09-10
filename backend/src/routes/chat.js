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
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
        num_predict: 1000,
        top_k: 40,
        repeat_penalty: 1.1,
      });

      for await (const chunk of response) {
        const content = chunk.message?.content || chunk.content || "";

        if (content) {
          res.write(`data: ${JSON.stringify({ content: content })}\n\n`);
        }
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
