// --- Dependencies ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // Load env variables first

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
if (!process.env.MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// --- Routes ---
const authRoutes = require('./routes/auth');
console.log('🧭 Loaded route file from:', path.resolve('./routes/auth'));

// ✅ FIXED: Mount the router under /api/auth
app.use('/api/auth', authRoutes);

// --- Gemini API Key Route ---
app.get('/api/get-api-key', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('⚠️ GEMINI_API_KEY not defined in .env');
    return res.status(500).json({
      success: false,
      message: 'API key is not configured on the server.',
    });
  }
  res.json({ apiKey });
});

// --- Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Contact Form Route ---
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const mailOptions = {
    from: `TextGen-AI Contact <${process.env.EMAIL_USER}>`,
    to: 'sonavanebharat92@gmail.com, huzaifaravat7@gmail.com',
    subject: '📩 TextGen-AI Contact Form Message',
    text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error);
      return res
        .status(500)
        .json({ success: false, message: `Mailer Error: ${error.message}` });
    }
    console.log('📨 Message sent:', info.messageId);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  });
});

// --- Debug Route (optional) ---
app.get('/api/debug-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) routes.push(r.route.path);
  });
  res.json({ routes });
});

// --- Health Check ---
app.get('/', (req, res) => {
  res.send('✅ TextGen-AI Server is running and healthy.');
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
