const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
    const userString = localStorage.getItem('fleet_user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Verification failed.');
    }

    return response.json();
};

export default apiRequest;
