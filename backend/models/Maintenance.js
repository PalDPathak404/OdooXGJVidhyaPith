const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        issue: {
            type: String,
            required: true,
        },
        serviceDate: {
            type: Date,
            default: Date.now,
        },
        cost: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
    },
    { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

module.exports = Maintenance;
