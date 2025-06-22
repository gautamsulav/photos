import { API_CONFIG, getApiUrl } from '../config/api';
import type { Trip, Photo, TripFormData } from '../types/index.ts';

// Helper function for API calls with standard configuration
const fetchWithConfig = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...API_CONFIG.HEADERS,
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// Trip CRUD operations
export const getAllTrips = async (): Promise<Trip[]> => {
    return fetchWithConfig(getApiUrl(API_CONFIG.ENDPOINTS.TRIPS));
};

export const getTripById = async (id: string): Promise<Trip> => {
    return fetchWithConfig(getApiUrl(`${API_CONFIG.ENDPOINTS.TRIPS}/${id}`));
};

export const createTrip = async (tripData: TripFormData): Promise<Trip> => {
    return fetchWithConfig(getApiUrl(API_CONFIG.ENDPOINTS.TRIPS), {
        method: 'POST',
        body: JSON.stringify(tripData),
    });
};

export const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<Trip> => {
    return fetchWithConfig(getApiUrl(`${API_CONFIG.ENDPOINTS.TRIPS}/${id}`), {
        method: 'PUT',
        body: JSON.stringify(tripData),
    });
};

export const deleteTrip = async (id: string): Promise<void> => {
    await fetchWithConfig(getApiUrl(`${API_CONFIG.ENDPOINTS.TRIPS}/${id}`), {
        method: 'DELETE',
    });
};

// Photo operations
export const uploadPhoto = async (tripId: string, file: File): Promise<Photo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tripId', tripId);

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PHOTOS + '/upload'), {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Photo upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const updatePhotoDescription = async (photoId: string, description: string): Promise<Photo> => {
    console.log('eteet');
    return fetchWithConfig(getApiUrl(`${API_CONFIG.ENDPOINTS.PHOTOS}/${photoId}/patch-detail`), {
        method: 'PUT',
        body: JSON.stringify({ description }),
    });
};

export const deletePhoto = async (photoId: string): Promise<void> => {
    await fetchWithConfig(getApiUrl(`${API_CONFIG.ENDPOINTS.PHOTOS}/${photoId}`), {
        method: 'DELETE',
    });
};