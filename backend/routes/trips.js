const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trip = require('../models/Trip');

// @route   GET /api/trips
// @desc    Get all trips
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('vehicleId')
            .populate('driverId')
            .sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ message: 'Server error fetching trips' });
    }
});

// @route   POST /api/trips
// @desc    Create a trip
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const trip = await Trip.create(req.body);
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Server error creating trip' });
    }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip status
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ message: 'Server error updating trip' });
    }
});

module.exports = router;
