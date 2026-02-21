const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        liters: {
            type: Number,
        },
        cost: {
            type: Number,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const FuelLog = mongoose.model("FuelLog", fuelLogSchema);

module.exports = FuelLog;
