const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get dashboard stats (protected)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const totalMessages = await Contact.countDocuments();
        const unreadMessages = await Contact.countDocuments({ status: 'unread' });
        
        // Recent bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(10);
        
        // Recent messages
        const recentMessages = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            success: true,
            stats: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                totalMessages,
                unreadMessages
            },
            recentBookings,
            recentMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all bookings (protected)
router.get('/bookings', authMiddleware, async (req, res) => {
    try {
        const { status, location, startDate, endDate } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (location) query.location = location;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        
        const bookings = await Booking.find(query).sort({ date: -1, time: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update booking status (protected)
router.put('/bookings/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        res.json({ success: true, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all messages (protected)
router.get('/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Mark message as read (protected)
router.put('/messages/:id/read', authMiddleware, async (req, res) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.json({ success: true, message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;