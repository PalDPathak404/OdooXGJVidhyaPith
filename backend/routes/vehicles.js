const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Server error fetching vehicles' });
    }
});

// @route   POST /api/vehicles
// @desc    Create a vehicle
// @access  Private
router.post('/', async (req, res) => {
    const { model, licensePlate, maxCapacity, odometer, status } = req.body;

    if (!model || !licensePlate || !maxCapacity) {
        return res.status(400).json({ message: 'Please provide model, license plate and max capacity' });
    }

    try {
        const vehicle = await Vehicle.create({
            model,
            licensePlate,
            maxCapacity,
            odometer: odometer || 0,
            status: status || 'Available'
        });
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
