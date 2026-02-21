const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth
app.use('/api/auth', require('./routes/auth'));

// Core fleet routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/trips', require('./routes/trips'));          // existing inline handlers
app.use('/api/trips', require('./routes/trip.routes'));    // service-layer dispatch/complete
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/analytics', require('./routes/analytics'));

app.listen(port, () => console.log(`Server started on port ${port}`));
