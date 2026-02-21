const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// Helper to convert month number to short string (e.g., 1 -> 'Jan')
const getMonthString = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
};

// @route   GET /api/analytics/fuel-trend
// @desc    Get total fuel expenses grouped by month
// @access  Private
router.get('/fuel-trend', protect, async (req, res) => {
    try {
        const trend = await Expense.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    totalFuelCost: { $sum: "$fuelCost" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const formattedTrend = trend.map(t => ({
            month: getMonthString(t._id),
            totalFuelCost: t.totalFuelCost
        }));

        res.status(200).json(formattedTrend);
    } catch (error) {
        console.error('Error fetching fuel trend:', error);
        res.status(500).json({ message: 'Server error fetching fuel trend' });
    }
});

// @route   GET /api/analytics/maintenance-trend
// @desc    Get total maintenance expenses grouped by month
// @access  Private
router.get('/maintenance-trend', protect, async (req, res) => {
    try {
        const trend = await Maintenance.aggregate([
            {
                $group: {
                    _id: { $month: "$serviceDate" },
                    totalMaintenanceCost: { $sum: "$cost" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const formattedTrend = trend.map(t => ({
            month: getMonthString(t._id),
            totalMaintenanceCost: t.totalMaintenanceCost
        }));

        res.status(200).json(formattedTrend);
    } catch (error) {
        console.error('Error fetching maintenance trend:', error);
        res.status(500).json({ message: 'Server error fetching maintenance trend' });
    }
});

// @route   GET /api/analytics/top-vehicles
// @desc    Get Top 5 Vehicles by total Expense
// @access  Private
router.get('/top-vehicles', protect, async (req, res) => {
    try {
        // Group expenses by vehicleId and sum totalCost
        const topVehicles = await Expense.aggregate([
            {
                $group: {
                    _id: "$vehicleId",
                    totalExpense: { $sum: "$totalCost" }
                }
            },
            {
                $sort: { "totalExpense": -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "vehicles", // MongoDB collection name for Vehicle schema usually lowercase + 's'
                    localField: "_id",
                    foreignField: "_id",
                    as: "vehicleDetails"
                }
            },
            {
                $unwind: "$vehicleDetails"
            },
            {
                $project: {
                    _id: 0,
                    vehicleId: "$_id",
                    vehicleModel: "$vehicleDetails.model",
                    licensePlate: "$vehicleDetails.licensePlate",
                    totalExpense: 1
                }
            }
        ]);

        res.status(200).json(topVehicles);
    } catch (error) {
        console.error('Error fetching top vehicles:', error);
        res.status(500).json({ message: 'Server error fetching top vehicles' });
    }
});

// @route   GET /api/analytics/monthly-summary
// @desc    Get combined monthly summary of trips, fuel, maintenance, and expenses
// @access  Private
router.get('/monthly-summary', protect, async (req, res) => {
    try {
        // We will process the aggregations concurrently
        const [tripsData, expensesData, maintenanceData] = await Promise.all([
            Trip.aggregate([{ $group: { _id: { $month: "$createdAt" }, totalTrips: { $sum: 1 } } }]),
            Expense.aggregate([{ $group: { _id: { $month: "$date" }, totalFuelCost: { $sum: "$fuelCost" }, totalExpense: { $sum: "$totalCost" } } }]),
            Maintenance.aggregate([{ $group: { _id: { $month: "$serviceDate" }, totalMaintenanceCost: { $sum: "$cost" } } }])
        ]);

        // Merge all data into a 1-12 month map
        const monthsMap = {};
        for (let i = 1; i <= 12; i++) {
            monthsMap[i] = {
                month: getMonthString(i),
                totalTrips: 0,
                totalFuelCost: 0,
                totalMaintenanceCost: 0,
                totalExpense: 0,
            };
        }

        tripsData.forEach(t => { if (t._id) monthsMap[t._id].totalTrips = t.totalTrips; });
        expensesData.forEach(e => {
            if (e._id) {
                monthsMap[e._id].totalFuelCost = e.totalFuelCost;
                monthsMap[e._id].totalExpense = e.totalExpense;
            }
        });
        maintenanceData.forEach(m => { if (m._id) monthsMap[m._id].totalMaintenanceCost = m.totalMaintenanceCost; });

        // Only return months that actually have data
        const summary = Object.values(monthsMap).filter(m =>
            m.totalTrips > 0 || m.totalExpense > 0 || m.totalMaintenanceCost > 0
        );

        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        res.status(500).json({ message: 'Server error fetching monthly summary' });
    }
});

module.exports = router;
