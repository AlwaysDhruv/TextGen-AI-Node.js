const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // To use environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer Transporter Configuration
// This is where you configure your email service provider.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env file (e.g., urbanunity12@gmail.com)
    pass: process.env.EMAIL_PASS, // Your app password from .env file
  },
});

// API Endpoint for handling the contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // --- Input Validation ---
  // Simple check to ensure all fields are present
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // --- Email Options ---
  // Define who sends, who receives, and the content of the email
  const mailOptions = {
    from: `TextGen-AI-Contact <${process.env.EMAIL_USER}>`,
    // Add both recipients in the 'to' field, separated by a comma
    to: 'sonavanebharat92@gmail.com, huzaifaravat7@gmail.com',
    subject: 'TextGen-AI', // Changed the subject line here
    // The email body is plain text, matching your PHP script's format
    text: `You received a message from TextGen-AI:\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n\n` +
          `Message:\n${message}`,
    // You can also use HTML for a richer format if you uncomment the line below
    // html: `<h3>You received a message from TextGen-AI:</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b></p><p>${message}</p>`
  };

  // --- Sending the Email ---
  // The transporter attempts to send the email with the options you defined
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Send a detailed error response back to the client
      return res.status(500).json({ success: false, message: `Mailer Error: ${error.message}` });
    }
    // If successful, send a success response
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});