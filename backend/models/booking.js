const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        enum: ['Bangalore', 'Noida', 'Gurgaon', 'Kolkata', 'Mumbai', 'Hyderabad']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },
    specialRequests: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    bookingReference: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate unique booking reference before saving
bookingSchema.pre('save', async function(next) {
    if (!this.bookingReference) {
        const prefix = 'SRH';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.bookingReference = `${prefix}${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);