const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

/**
 * Validates that the vehicle exists and is currently available for dispatch.
 * @param {string} vehicleId - MongoDB ObjectId of the vehicle.
 */
const validateVehicleAvailability = async (vehicleId) => {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new Error(`Vehicle not found: ${vehicleId}`);
    }
    if (vehicle.status !== "Available") {
        throw new Error(
            `Vehicle is not available. Current status: "${vehicle.status}"`
        );
    }
};

/**
 * Validates that the driver exists and is currently on duty.
 * @param {string} driverId - MongoDB ObjectId of the driver.
 */
const validateDriverAvailability = async (driverId) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new Error(`Driver not found: ${driverId}`);
    }
    if (driver.status !== "OnDuty") {
        throw new Error(
            `Driver is not available. Current status: "${driver.status}"`
        );
    }
};

/**
 * Validates that the driver's license has not expired.
 * @param {string} driverId - MongoDB ObjectId of the driver.
 */
const validateLicenseExpiry = async (driverId) => {
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new Error(`Driver not found: ${driverId}`);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(driver.licenseExpiry) < today) {
        throw new Error(
            `Driver's license has expired on ${driver.licenseExpiry.toDateString()}. Renewal required before dispatch.`
        );
    }
};

/**
 * Validates that the trip's cargo weight does not exceed the vehicle's max capacity.
 * @param {string} vehicleId - MongoDB ObjectId of the vehicle.
 * @param {number} cargoWeight - Weight of cargo to be loaded (in kg or relevant unit).
 */
const validateCargoCapacity = async (vehicleId, cargoWeight) => {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new Error(`Vehicle not found: ${vehicleId}`);
    }
    if (cargoWeight > vehicle.maxCapacity) {
        throw new Error(
            `Cargo weight (${cargoWeight}) exceeds vehicle max capacity (${vehicle.maxCapacity}).`
        );
    }
};

/**
 * Applies state transitions when a trip is dispatched.
 * Marks vehicle as "OnTrip".
 * Driver remains "OnDuty" — assignment tracking is handled at the trip level.
 * @param {string} vehicleId - MongoDB ObjectId of the vehicle.
 * @param {string} driverId - MongoDB ObjectId of the driver.
 */
const applyDispatchStateTransition = async (vehicleId, driverId) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
        vehicleId,
        { status: "OnTrip" },
        { new: true }
    );
    if (!vehicle) {
        throw new Error(`Failed to update vehicle status: Vehicle ${vehicleId} not found.`);
    }

    // Placeholder: driver stays "OnDuty"; reservation logic can be added here
    // e.g., Driver.findByIdAndUpdate(driverId, { status: "OnDuty" })
    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new Error(`Driver not found during dispatch transition: ${driverId}`);
    }
};

/**
 * Applies state transitions when a trip is completed.
 * Marks vehicle as "Available", updates odometer if provided.
 * Marks driver as "OnDuty" (available for next trip).
 * @param {string} vehicleId - MongoDB ObjectId of the vehicle.
 * @param {string} driverId - MongoDB ObjectId of the driver.
 * @param {number|null} endOdometer - Final odometer reading at trip end.
 */
const applyTripCompletionTransition = async (vehicleId, driverId, endOdometer) => {
    const vehicleUpdate = { status: "Available" };
    if (endOdometer !== undefined && endOdometer !== null) {
        vehicleUpdate.odometer = endOdometer;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, vehicleUpdate, {
        new: true,
    });
    if (!vehicle) {
        throw new Error(`Failed to update vehicle on trip completion: Vehicle ${vehicleId} not found.`);
    }

    const driver = await Driver.findByIdAndUpdate(
        driverId,
        { status: "OnDuty" },
        { new: true }
    );
    if (!driver) {
        throw new Error(`Failed to update driver on trip completion: Driver ${driverId} not found.`);
    }
};

/**
 * Orchestrates full dispatch validation and state transition atomically.
 * Runs all validations in order before any state is mutated.
 * If any validation fails, an error is thrown and no DB writes occur.
 * @param {Object} params
 * @param {string} params.vehicleId   - MongoDB ObjectId of the vehicle.
 * @param {string} params.driverId    - MongoDB ObjectId of the driver.
 * @param {number} params.cargoWeight - Weight of cargo to be loaded.
 * @returns {Promise<Object>} The updated vehicle document after dispatch.
 */
const dispatchTripWithValidation = async ({ vehicleId, driverId, cargoWeight }) => {
    // Step 1 – 4: All validations must pass before any state is changed.
    await validateVehicleAvailability(vehicleId);
    await validateDriverAvailability(driverId);
    await validateLicenseExpiry(driverId);
    await validateCargoCapacity(vehicleId, cargoWeight);

    // Step 5: Only reached if all validations pass.
    await applyDispatchStateTransition(vehicleId, driverId);

    // Return the latest vehicle document reflecting the new "OnTrip" status.
    const updatedVehicle = await Vehicle.findById(vehicleId);
    return updatedVehicle;
};

module.exports = {
    validateVehicleAvailability,
    validateDriverAvailability,
    validateLicenseExpiry,
    validateCargoCapacity,
    applyDispatchStateTransition,
    applyTripCompletionTransition,
    dispatchTripWithValidation,
};
