// backend/routes/summary.js
const express = require('express');
const router = express.Router();
require('dotenv').config(); // Auto-load .env variables
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load Gemini API key from .env automatically
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('❌ Missing GEMINI_API_KEY in .env file.');
  process.exit(1);
}

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// POST /api/summary
// Body: { messages: [{role: 'user'|'assistant', text: '...'}] }
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const prompt = `
You are an AI assistant that summarizes and tags conversation history.

Conversation:
${messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Task:
1) Provide a short summary in 3–5 bullet points.
2) Extract 3–6 topic tags (comma-separated).

Return valid JSON with keys 'summary' and 'tags'.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() || '';

    if (!text.trim()) {
      // Safety: empty model output
      return res.status(200).json({
        summary: '⚠️ No summary generated — model returned empty response.',
        tags: []
      });
    }

    let summary = '';
    let tags = [];

    try {
      const parsed = JSON.parse(text);
      summary = parsed.summary || '';
      tags = parsed.tags || [];
    } catch {
      const lines = text.split('\n');
      summary = lines.slice(0, 5).join('\n');
      const tagLine = lines.find(l => l.toLowerCase().includes('tag'));
      tags = tagLine ? tagLine.split(':')[1]?.split(',').map(t => t.trim()) : [];
    }

    res.status(200).json({ summary, tags });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      summary: '',
      tags: [],
      error: 'Internal server error while generating summary'
    });
  }
});

module.exports = router;
