const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trip = require('../models/Trip');
const { dispatchTripWithValidation } = require('../services/tripRules.service');

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

// @desc    Dispatch a trip (Uses upstreams validation service constraints)
// @route   POST /api/trips/dispatch
// @access  Private
router.post('/dispatch', protect, async (req, res) => {
    const { vehicleId, driverId, cargoWeight, startOdometer } = req.body;

    if (!vehicleId || !driverId || !cargoWeight) {
        return res.status(400).json({ message: 'Please provide vehicleId, driverId and cargoWeight' });
    }

    try {
        // Use the validation service to handle rules and state transitions
        const updatedVehicle = await dispatchTripWithValidation({
            vehicleId,
            driverId,
            cargoWeight
        });

        // Create the trip record
        const trip = await Trip.create({
            vehicleId,
            driverId,
            cargoWeight,
            startOdometer: startOdometer || updatedVehicle.odometer,
            status: 'Dispatched'
        });

        res.status(201).json({
            message: 'Trip dispatched successfully',
            trip,
            vehicle: updatedVehicle
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
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
