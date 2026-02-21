const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        safetyScore: {
            type: Number,
            default: 100,
        },
        status: {
            type: String,
            enum: ["On Duty", "Taking a Break", "Suspended"],
            default: "On Duty",
        },
    },
    { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
