const express = require("express");
const router = express.Router();
const { dispatchTrip, completeTrip } = require("../controllers/trip.controller");

// POST /api/trips/dispatch
router.post("/dispatch", dispatchTrip);

// POST /api/trips/complete
router.post("/complete", completeTrip);

module.exports = router;
