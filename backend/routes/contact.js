const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// Submit contact form
router.post('/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('message').notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        try {
            const contact = new Contact(req.body);
            await contact.save();
            
            res.status(201).json({
                success: true,
                message: 'Message sent successfully! We will get back to you soon.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

module.exports = router;