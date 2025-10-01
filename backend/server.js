const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// Make sure dotenv is configured at the very top
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
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
app.use('/api/auth', authRoutes);


// --- NEW: API Key Route ---
// This endpoint provides the Gemini API key to the frontend securely.
app.get('/api/get-api-key', (req, res) => {
    // It reads the key from the server's environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not defined in the .env file.');
        return res.status(500).json({ success: false, message: 'API key is not configured on the server.' });
    }
    res.json({ apiKey });
});


// --- Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
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
        subject: 'TextGen-AI Contact Form',
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: `Mailer Error: ${error.message}` });
        }
        console.log('📨 Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// --- Start server ---
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});