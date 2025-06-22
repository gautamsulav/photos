// hooks/useTrips.ts
import { useState, useEffect } from 'react';
import type { Trip, TripFormData } from '../types/index.ts';
import * as apiService from '../service/apiService';


export const useTrips = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedTrips = await apiService.getAllTrips();
            setTrips(fetchedTrips);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch trips');
            console.error('Error fetching trips:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const createTrip = async (tripData: TripFormData): Promise<Trip | null> => {
        try {
            setLoading(true);
            setError(null);
            const newTrip = await apiService.createTrip(tripData);
            setTrips(prev => [...prev, newTrip]);
            return newTrip;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create trip');
            console.error('Error creating trip:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<Trip | null> => {
        try {
            setLoading(true);
            setError(null);
            const updatedTrip = await apiService.updateTrip(id, tripData);
            setTrips(prev => prev.map(trip => trip.id === id ? updatedTrip : trip));
            return updatedTrip;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update trip');
            console.error('Error updating trip:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteTrip = async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await apiService.deleteTrip(id);
            setTrips(prev => prev.filter(trip => trip.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete trip');
            console.error('Error deleting trip:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadPhoto = async (tripId: string, file: File): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const newPhoto = await apiService.uploadPhoto(tripId, file);
            setTrips(prev => prev.map(trip =>
                trip.id === tripId
                    ? { ...trip, photos: [...trip.photos, newPhoto] }
                    : trip
            ));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload photo');
            console.error('Error uploading photo:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updatePhotoDescription = async (tripId: string, photoId: string, description: string): Promise<boolean> => {
        try {
            setError(null);
            const updatedPhoto = await apiService.updatePhotoDescription(photoId, description);
            setTrips(prev => prev.map(trip =>
                trip.id === tripId
                    ? {
                        ...trip,
                        photos: trip.photos.map(photo =>
                            photo.id === photoId ? updatedPhoto : photo
                        )
                    }
                    : trip
            ));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update photo description');
            console.error('Error updating photo description:', err);
            return false;
        }
    };

    const deletePhoto = async (tripId: string, photoId: string): Promise<boolean> => {
        try {
            setError(null);
            await apiService.deletePhoto(photoId);
            setTrips(prev => prev.map(trip =>
                trip.id === tripId
                    ? { ...trip, photos: trip.photos.filter(photo => photo.id !== photoId) }
                    : trip
            ));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete photo');
            console.error('Error deleting photo:', err);
            return false;
        }
    };

    return {
        trips,
        loading,
        error,
        createTrip,
        updateTrip,
        deleteTrip,
        uploadPhoto,
        updatePhotoDescription,
        deletePhoto,
        refetch: fetchTrips,
    };
};