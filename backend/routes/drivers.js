const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Driver = require('../models/Driver');

// Helper to check safety lock logic
const getDriverStatus = (expiryDate, currentStatus) => {
    const isExpired = new Date(expiryDate) < new Date();
    return isExpired ? 'Suspended' : (currentStatus || 'On Duty');
};

// @route   POST /api/drivers
// @desc    Add new driver
// @access  Private
router.post('/', async (req, res) => {
    const { name, licenseNumber, expiryDate, rating, safetyScore, status } = req.body;

    if (!name || !licenseNumber || !expiryDate) {
        return res.status(400).json({ message: 'Please include name, licenseNumber, and expiryDate' });
    }

    try {
        const driverExists = await Driver.findOne({ licenseNumber });
        if (driverExists) {
            return res.status(400).json({ message: 'Driver with this license number already exists' });
        }

        // Apply Safety Lock logic
        const evaluatedStatus = getDriverStatus(expiryDate, status);

        const driver = await Driver.create({
            name,
            licenseNumber,
            expiryDate,
            rating: rating || 0,
            safetyScore: safetyScore !== undefined ? safetyScore : 100,
            status: evaluatedStatus,
        });

        res.status(201).json(driver);
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({ message: 'Server error creating driver' });
    }
});

// @route   GET /api/drivers
// @desc    Get all drivers
// @access  Private
router.get('/', async (req, res) => {
    try {
        let drivers = await Driver.find().sort({ createdAt: -1 });

        // Evaluated status (Optional Safety check on GET ensures dynamic locking if date passed recently)
        let modified = false;
        drivers = await Promise.all(drivers.map(async (driver) => {
            const evaluatedStatus = getDriverStatus(driver.expiryDate, driver.status);
            if (evaluatedStatus === 'Suspended' && driver.status !== 'Suspended') {
                driver.status = 'Suspended';
                await driver.save();
                modified = true;
            }
            return driver;
        }));

        res.status(200).json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ message: 'Server error fetching drivers' });
    }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver details
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // If expiryDate or status is being updated, evaluate Safety Lock
        const newExpiryDate = req.body.expiryDate || driver.expiryDate;
        const newStatus = req.body.status || driver.status;

        req.body.status = getDriverStatus(newExpiryDate, newStatus);

        const updatedDriver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ message: 'Server error updating driver' });
    }
});

module.exports = router;
