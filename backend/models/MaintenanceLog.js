const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        type: {
            type: String,
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

const MaintenanceLog = mongoose.model("MaintenanceLog", maintenanceLogSchema);

module.exports = MaintenanceLog;
