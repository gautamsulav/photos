// TripManager.tsx (Main Component)
import { useState, useEffect } from 'react';
import { GalleryView } from './GalleryView.tsx';
import { TripForm } from './TripForm.tsx';
import { TripDetail } from './TripDetail.tsx';
import { useTrips } from '@/hooks/useTrips.ts';
import type { Trip, ViewType, TripFormData } from '../../types/index.ts';

const TripManager = () => {
    // Set body background style
    useEffect(() => {
        document.body.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)';
        document.body.style.minHeight = '100vh';

        // Cleanup on unmount
        return () => {
            document.body.style.background = '';
            document.body.style.minHeight = '';
        };
    }, []);

    const {
        trips,
        loading,
        error,
        createTrip,
        updateTrip,
        deleteTrip,
        uploadPhoto,
        updatePhotoDescription,
        deletePhoto,
    } = useTrips();

    const [currentView, setCurrentView] = useState<ViewType>('gallery');
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    // Handler functions
    const handleCreateTrip = async (formData: TripFormData) => {
        const newTrip = await createTrip(formData as TripFormData);
        if (newTrip) {
            setCurrentView('gallery');
        }
    };

    const handleUpdateTrip = async (tripData: never) => {
        if (!editingTrip) return;

        const updatedTrip = await updateTrip(editingTrip.id, tripData as Partial<Trip>);
        if (updatedTrip) {
            setEditingTrip(null);
            setCurrentView('gallery');
        }
    };

    const handleDeleteTrip = async (tripId: string) => {
        const success = await deleteTrip(tripId);
        if (success) {
            setEditingTrip(null);
            setCurrentView('gallery');
        }
    };

    const handleUploadPhoto = async (tripId: string, file: File) => {
        const success = await uploadPhoto(tripId, file);
        if (success && selectedTrip) {
            // Update selected trip with new photos from the trips state
            const updatedTrip = trips.find(trip => trip.id === tripId);
            if (updatedTrip) {
                setSelectedTrip(updatedTrip);
            }
        }
    };

    const handleUpdatePhotoDescription = async (tripId: string, photoId: string, description: string) => {
        alert('hello');
        const success = await updatePhotoDescription(tripId, photoId, description);
        if (success && selectedTrip) {
            // Update selected trip with updated photo description
            const updatedTrip = trips.find(trip => trip.id === tripId);
            if (updatedTrip) {
                setSelectedTrip(updatedTrip);
            }
        }
    };

    const handleDeletePhoto = async (tripId: string, photoId: string) => {
        const success = await deletePhoto(tripId, photoId);
        if (success && selectedTrip) {
            // Update selected trip with removed photo
            const updatedTrip = trips.find(trip => trip.id === tripId);
            if (updatedTrip) {
                setSelectedTrip(updatedTrip);
            }
        }
    };

    // Navigation handlers
    const handleViewTrip = (trip: Trip) => {
        setSelectedTrip(trip);
        setCurrentView('detail');
    };

    const handleEditTrip = (trip: Trip) => {
        setEditingTrip(trip);
        setCurrentView('edit');
    };

    const handleBackToGallery = () => {
        setSelectedTrip(null);
        setEditingTrip(null);
        setCurrentView('gallery');
    };

    // Render based on current view
    switch (currentView) {
        case 'gallery':
            return (
                <GalleryView
                    trips={trips}
                    loading={loading}
                    error={error}
                    onCreateTrip={() => setCurrentView('create')}
                    onEditTrip={handleEditTrip}
                    onViewTrip={handleViewTrip}
                />
            );

        case 'create':
             return (
                <TripForm
                    mode="create"
                    loading={loading}
                    onSubmit={handleCreateTrip}
                    onCancel={handleBackToGallery}
                />
            );

        case 'edit':
            return (
                <TripForm
                    mode="edit"
                    trip={editingTrip}
                    loading={loading}
                    onSubmit={handleUpdateTrip}
                    onCancel={handleBackToGallery}
                    onDelete={handleDeleteTrip}
                />
            );

        case 'detail':
            return selectedTrip ? (
                <TripDetail
                    trip={selectedTrip}
                    loading={loading}
                    onBack={handleBackToGallery}
                    onUploadPhoto={handleUploadPhoto}
                    onUpdatePhotoDescription={handleUpdatePhotoDescription}
                    onDeletePhoto={handleDeletePhoto}
                />
            ) : null;

        default:
            return null;
    }
};

export default TripManager;