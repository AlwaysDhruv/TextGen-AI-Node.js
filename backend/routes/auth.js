// backend/routes/auth.js

console.log('✅ auth.js loaded successfully');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// --- SIGNUP ---
router.post('/signup', async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                msg: 'User already exists'
            });
        }

        // CORRECT: Pass the plain-text password directly.
        // The pre('save') hook in User.js will handle the hashing.
        user = new User({
            name,
            email,
            password
        });
        await user.save(); // Hashing now happens automatically here.

        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({
            token,
            user: {
                id: user._id, // Also good to return the ID
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            msg: 'Server error'
        });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            // Use 'msg' to be consistent with the frontend code
            return res.status(401).json({
                msg: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Use 'msg' to be consistent with the frontend code
            return res.status(401).json({
                msg: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            msg: 'Server error' // Use 'msg' for consistency
        });
    }
});


// --- OTP Routes (No changes needed here) ---

router.post('/send-otp', async (req, res) => {
    const {
        email
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) return res.status(404).json({
            msg: 'User not found'
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}`);

        res.json({
            msg: 'OTP sent successfully!'
        });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({
            msg: 'Error sending OTP'
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    const {
        email,
        otp,
        newPassword
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) return res.status(404).json({
            msg: 'User not found'
        });

        if (!user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                msg: 'OTP expired or invalid'
            });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) return res.status(400).json({
            msg: 'Invalid OTP'
        });

        // Pass the plain-text newPassword. The pre('save') hook will handle it.
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            msg: 'Password reset successfully!'
        });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({
            msg: 'Error verifying OTP'
        });
    }
});


module.exports = router;