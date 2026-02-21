const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        licenseExpiry: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["OnDuty", "OffDuty", "Suspended"],
            default: "OnDuty",
        },
        safetyScore: {
            type: Number,
            default: 100,
        },
    },
    { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
