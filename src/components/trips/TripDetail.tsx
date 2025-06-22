import React, {useEffect, useState} from 'react';
import { X, Upload, Trash2, Save, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'; // Added ChevronLeft, ChevronRight for navigation
import type { Photo, Trip } from '../../types/index.ts'; // Assuming GalleryImage is now available or defined in types.ts

interface TripDetailProps {
    trip: Trip;
    loading: boolean;
    onBack: () => void;
    onUploadPhoto: (tripId: string, file: File) => void;
    onUpdatePhotoDescription: (tripId: string, photoId: string, description: string) => void;
    onDeletePhoto: (tripId: string, photoId: string) => void;
}

export const TripDetail: React.FC<TripDetailProps> = ({
                                                          trip,
                                                          loading,
                                                          onBack,
                                                          onUploadPhoto,
                                                          onUpdatePhotoDescription,
                                                          onDeletePhoto,
                                                      }) => {
    const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<Photo | null>(null); // State for fullscreen image

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    onUploadPhoto(trip.id, file);
                }
            });
        }
        event.target.value = '';
    };

    const handleStartEditing = (photo: Photo) => {
        setEditingPhoto(photo.id);
        setEditingText(photo.description ?? '');
    };

    const handleSaveDescription = (photoId: string) => {
        onUpdatePhotoDescription(trip.id, photoId, editingText);
        setEditingPhoto(null); // Exit editing mode
    };

    const handleCancelEditing = () => {
        setEditingPhoto(null);
        setEditingText('');
    };

    // New functions for fullscreen gallery
    const openFullscreen = (image: Photo): void => {
        setSelectedImage(image);
    };

    const closeFullscreen = (): void => {
        setSelectedImage(null);
    };

    const navigateFullscreen = (direction: 'prev' | 'next') => {
        if (!selectedImage) return;

        const currentIndex = trip.photos.findIndex(p => p.id === selectedImage.id);
        let nextIndex: number;

        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % trip.photos.length;
        } else {
            nextIndex = (currentIndex - 1 + trip.photos.length) % trip.photos.length;
        }

        setSelectedImage(trip.photos[nextIndex]);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (selectedImage) { // Only active when fullscreen is open
                if (event.key === 'ArrowLeft') {
                    navigateFullscreen('prev');
                } else if (event.key === 'ArrowRight') {
                    navigateFullscreen('next');
                } else if (event.key === 'Escape') {
                    closeFullscreen();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage, navigateFullscreen, closeFullscreen]); // Depend on selectedImage, and the navigation functions

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-64">
                        <img
                            src={trip.thumbnail ? trip.thumbnail.publicUrl : ''}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <button
                            onClick={onBack}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {trip.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                </div>
                            </div>
                            <p className="text-gray-700">{trip.description}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Photos</h2>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        id={`photo-upload-${trip.id}`}
                                        disabled={loading}
                                    />
                                    <label
                                        htmlFor={`photo-upload-${trip.id}`}
                                        className={`${
                                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                        } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                                    >
                                        <Upload size={16} />
                                        {loading ? 'Uploading...' : 'Add Photos'}
                                    </label>
                                </div>
                            </div>

                            {trip.photos.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Upload size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No photos yet. Upload some to capture your memories!</p>
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id={`empty-photo-upload-${trip.id}`}
                                            disabled={loading}
                                        />
                                        <label
                                            htmlFor={`empty-photo-upload-${trip.id}`}
                                            className={`inline-flex items-center gap-2 ${
                                                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                            } text-white px-6 py-3 rounded-lg transition-colors`}
                                        >
                                            <Upload size={20} />
                                            {loading ? 'Uploading...' : 'Upload Your First Photos'}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {trip.photos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            className="group relative cursor-pointer" // Added cursor-pointer
                                            onClick={() => openFullscreen(photo)} // Added onClick to open fullscreen
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={photo.publicUrl}
                                                    alt={photo.description}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent opening fullscreen when deleting
                                                    onDeletePhoto(trip.id, photo.id);
                                                }}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="mt-2">
                                                {editingPhoto === photo.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingText}
                                                            onChange={(e) => {
                                                                setEditingText(e.target.value);
                                                            }}
                                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            onBlur={handleCancelEditing}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveDescription(photo.id);
                                                                } else if (e.key === 'Escape') {
                                                                    handleCancelEditing();
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onMouseDown={() => handleSaveDescription(photo.id)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p
                                                        className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent opening fullscreen when editing
                                                            handleStartEditing(photo);
                                                        }}
                                                    >
                                                        {photo.description ?? "Set Caption"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal (Copied and adapted from PhotoGallery) */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/[0.95] flex items-center justify-center p-4">
                    {/* Close button */}
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
                        aria-label="Close fullscreen view"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation buttons */}
                    {trip.photos.length > 1 && (
                        <>
                            <button
                                onClick={() => navigateFullscreen('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => navigateFullscreen('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Modal content */}
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage.publicUrl} // Use publicUrl for Photo type
                            alt={selectedImage.description ?? "Trip photo"} // Use description for Photo type
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />

                        {/* Image caption */}
                        {selectedImage.description && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                                {selectedImage.description}
                            </div>
                        )}
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeFullscreen}
                        aria-label="Click to close"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Escape') closeFullscreen();
                        }}
                    />
                </div>
            )}
        </div>
    );
};