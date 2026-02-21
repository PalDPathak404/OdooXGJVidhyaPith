const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
        },
        cargoWeight: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
            default: "Draft",
        },
        startOdometer: {
            type: Number,
        },
        endOdometer: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
