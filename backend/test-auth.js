const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        console.log('--- Testing Registration ---');
        const regRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('Registration Success:', regRes.data);

        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: regRes.data.email,
            password: 'password123'
        });
        console.log('Login Success. Token received:', loginRes.data.token.substring(0, 20) + '...');

        console.log('\n--- Verification Complete ---');
    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
};

// Before running this, ensure the server is running with 'npm start' (if start script exists)
// or 'node server.js' and MongoDB is connected.
// Since I cannot run the server in the background easily while testing in the same step,
// I'll provide this script for the user to run.
// I'll also add a 'start' script to package.json.
