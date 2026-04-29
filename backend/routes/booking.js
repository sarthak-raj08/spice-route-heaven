const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { body, validationResult } = require('express-validator');

// Create new booking
router.post('/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('location').isIn(['Bangalore', 'Noida', 'Gurgaon', 'Kolkata', 'Mumbai', 'Hyderabad']),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('time').notEmpty().withMessage('Time is required'),
        body('guests').isInt({ min: 1, max: 50 }).withMessage('Guests must be between 1 and 50')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        try {
            const booking = new Booking(req.body);
            await booking.save();
            
            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                bookingReference: booking.bookingReference,
                booking: booking
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Get booking by reference (public)
router.get('/:reference', async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingReference: req.params.reference });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;