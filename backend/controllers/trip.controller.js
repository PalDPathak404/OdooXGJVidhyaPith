const { tripRules } = require("../services");

/**
 * POST /api/trips/dispatch
 * Body: { vehicleId, driverId, cargoWeight }
 */
const dispatchTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, cargoWeight } = req.body;
        const vehicle = await tripRules.dispatchTripWithValidation({ vehicleId, driverId, cargoWeight });
        return res.status(200).json({ success: true, vehicle });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/trips/complete
 * Body: { vehicleId, driverId, startOdometer, endOdometer }
 */
const completeTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, startOdometer, endOdometer } = req.body;
        const metrics = await tripRules.completeTripWithMetrics({ vehicleId, driverId, startOdometer, endOdometer });
        return res.status(200).json({ success: true, metrics });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    dispatchTrip,
    completeTrip,
};
