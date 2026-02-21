const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// @route   POST /api/maintenance
// @desc    Create service log and auto-hide vehicle
// @access  Private
router.post('/', protect, async (req, res) => {
    const { vehicleId, issue, serviceDate, cost, status } = req.body;

    if (!vehicleId || !issue || cost === undefined) {
        return res.status(400).json({ message: 'Please include all required fields' });
    }

    try {
        const record = await Maintenance.create({
            vehicleId,
            issue,
            cost,
            status: status || 'Open',
            serviceDate: serviceDate || Date.now(),
        });

        // Auto-Hide Rule: set Vehicle status to InShop
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle) {
            vehicle.status = 'InShop';
            await vehicle.save();
        }

        res.status(201).json(record);
    } catch (error) {
        console.error('Error creating maintenance record:', error);
        res.status(500).json({ message: 'Server error creating maintenance record' });
    }
});

// @route   GET /api/maintenance
// @desc    Get all maintenance records
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const records = await Maintenance.find()
            .populate('vehicleId')
            .sort({ createdAt: -1 });

        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching maintenance records:', error);
        res.status(500).json({ message: 'Server error fetching maintenance records' });
    }
});

// @route   PUT /api/maintenance/:id
// @desc    Update status
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Please provide status to update' });
    }

    try {
        const record = await Maintenance.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        record.status = status;
        const updatedRecord = await record.save();

        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating maintenance status:', error);
        res.status(500).json({ message: 'Server error updating maintenance status' });
    }
});

module.exports = router;
