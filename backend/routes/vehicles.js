const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Add a vehicle
// @route   POST /api/vehicles
// @access  Public
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
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
