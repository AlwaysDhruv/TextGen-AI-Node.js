// New global registry to track active streams
const activeStreams = new Map();

// POST /api/stream  → allows large prompts
router.post('/stream', async (req, res) => {
  const { message, streamId } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Create AbortController and save in map
  const controller = new AbortController();
  activeStreams.set(streamId, controller);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const modelName = 'gemini-2.5-flash';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${encodeURIComponent(geminiApiKey)}&alt=sse`;
  const payload = { contents: [{ role: 'user', parts: [{ text: message }] }] };

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          res.write(`data: ${line.substring(6)}\n\n`);
        }
      }
    }
    res.write(`event: end\ndata: {}\n\n`);
  } catch (err) {
    if (err.name !== 'AbortError')
      res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
  } finally {
    activeStreams.delete(streamId);
    res.end();
  }
});

// POST /api/stop/:id → cancels a running stream
router.post('/stop/:id', (req, res) => {
  const id = req.params.id;
  const controller = activeStreams.get(id);
  if (!controller) return res.status(404).json({ error: 'Stream not found' });

  controller.abort();
  activeStreams.delete(id);
  res.json({ success: true });
});
