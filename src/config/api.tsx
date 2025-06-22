export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080', // Update this URL as needed
    ENDPOINTS: {
        TRIPS: '/api/trips',
        PHOTOS: '/api/photos',
    },
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

// Helper function to construct full URLs
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};