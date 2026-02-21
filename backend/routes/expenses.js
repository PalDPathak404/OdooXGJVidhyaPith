const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Add new expense mapping with totalCost auto calculation
// @access  Private (auth temporarily disabled for hackathon testing)
router.post('/', async (req, res) => {
    const { tripId, driverId, distance, fuelLiters, fuelPricePerLiter, maintenanceCost, notes } = req.body;

    if (!tripId || !driverId || distance === undefined || fuelLiters === undefined || fuelPricePerLiter === undefined || maintenanceCost === undefined) {
        return res.status(400).json({ message: 'Please include all required fields' });
    }

    try {
        // Automatically calculate fuelCost and totalCost
        const fuelCost = Number(fuelLiters) * Number(fuelPricePerLiter);
        const totalCost = fuelCost + Number(maintenanceCost);

        const expense = await Expense.create({
            tripId,
            driverId,
            distance,
            fuelLiters,
            fuelPricePerLiter,
            fuelCost,
            maintenanceCost,
            notes,
            totalCost,
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error('Error creating expense record:', error);
        res.status(500).json({ message: 'Server error creating expense record' });
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('tripId')
            .populate('driverId')
            .sort({ createdAt: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error fetching expenses' });
    }
});

module.exports = router;
