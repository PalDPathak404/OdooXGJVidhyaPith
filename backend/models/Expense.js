const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
        },
        distance: {
            type: Number,
            required: true,
        },
        fuelCost: {
            type: Number,
            required: true,
        },
        maintenanceCost: {
            type: Number,
            required: true,
        },
        notes: {
            type: String,
        },
        totalCost: {
            type: Number,
        }
    },
    { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
