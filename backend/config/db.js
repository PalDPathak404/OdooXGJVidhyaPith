const mongoose = require("mongoose");

const connectDB = async () => {
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    console.log("Mongo URI loaded:", !!mongoURI ? "true" : "false (check .env)");
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
    }

    console.log("Connecting to MongoDB:", mongoURI);

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // crash app if DB fails
  }
};

module.exports = connectDB;