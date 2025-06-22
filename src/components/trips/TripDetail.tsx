import React, { useState } from 'react';
import { X, Upload, Trash2, Save, Calendar, MapPin } from 'lucide-react';
import type {Photo, Trip} from '../../types/index.ts';

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
    // This new state tracks the TEXT of the caption being edited
    const [editingText, setEditingText] = useState<string>('');
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
        console.log(photo.id, editingText, editingPhoto);
    };

    const handleSaveDescription = (photoId: string) => {
        alert('part two');
        onUpdatePhotoDescription(trip.id, photoId, editingText);
        setEditingPhoto(null); // Exit editing mode
    };

    const handleCancelEditing = () => {
        setEditingPhoto(null);
        setEditingText('');
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-64">
                        <img
                            src={trip.coverImage}
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
                                        <div key={photo.id} className="group relative">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={photo.publicUrl}
                                                    alt={photo.description}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <button
                                                onClick={() => onDeletePhoto(trip.id, photo.id)}
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
                                                        onClick={() => handleStartEditing(photo)}
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
        </div>
    );
};