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

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = { message: await response.text() };
    }

    if (!response.ok) {
        throw new Error(data.message || `Verification failed (Status: ${response.status})`);
    }

    return data;
};

export default apiRequest;
