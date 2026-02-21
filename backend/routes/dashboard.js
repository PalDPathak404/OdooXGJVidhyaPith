const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');

// @route   GET /api/dashboard
// @desc    Get dashboard KPIs and alerts
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Active Fleet (Status OnTrip or Available)
        const totalVehicles = await Vehicle.countDocuments();
        const activeVehicles = await Vehicle.countDocuments({ status: { $in: ['Available', 'OnTrip'] } });

        // Maintenance Alerts (Vehicles InShop or with open maintenance logs)
        const maintenanceAlerts = await Maintenance.countDocuments({ status: 'Open' });

        // Pending Trips
        const pendingTrips = await Trip.countDocuments({ status: 'Draft' }); // Or 'Dispatched'

        res.status(200).json({
            activeFleet: {
                total: totalVehicles,
                active: activeVehicles
            },
            maintenanceAlerts,
            pendingTrips
        });
    } catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
        res.status(500).json({ message: 'Server error fetching dashboard KPIs' });
    }
});

module.exports = router;
