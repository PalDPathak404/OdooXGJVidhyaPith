const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { dispatchTripWithValidation } = require('../services/tripRules.service');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().populate('vehicleId').populate('driverId');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Dispatch a trip
// @route   POST /api/trips/dispatch
// @access  Public
router.post('/dispatch', async (req, res) => {
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

module.exports = router;
