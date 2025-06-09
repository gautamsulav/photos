import React, { useState } from 'react';
import { Plus, Edit2, Calendar, MapPin, X, Upload, Trash2, Save } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
    description: string;
}

interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    photos: Photo[];
    coverImage: string;
}

const TripManager = () => {
    // Set body background style
    React.useEffect(() => {
        document.body.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)';
        document.body.style.minHeight = '100vh';

        // Cleanup on unmount
        return () => {
            document.body.style.background = '';
            document.body.style.minHeight = '';
        };
    }, []);
    const [trips, setTrips] = useState<Trip[]>([
        {
            id: '1',
            name: 'Mountain Adventure',
            startDate: '2024-06-01',
            endDate: '2024-06-07',
            location: 'Rocky Mountains, Colorado',
            description: 'An amazing hiking trip through the Rocky Mountains with breathtaking views.',
            coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            photos: [
                { id: 'p1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', description: 'Summit view at sunrise' },
                { id: 'p2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', description: 'Forest trail' }
            ]
        },
        {
            id: '2',
            name: 'Beach Paradise',
            startDate: '2024-07-15',
            endDate: '2024-07-22',
            location: 'Maldives',
            description: 'Relaxing beach vacation with crystal clear waters and white sand.',
            coverImage: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&h=600&fit=crop',
            photos: [
                { id: 'p3', url: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=400&h=300&fit=crop', description: 'Sunset over the ocean' }
            ]
        }
    ]);

    const [currentView, setCurrentView] = useState<'gallery' | 'detail' | 'create' | 'edit'>('gallery');
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [editingPhoto, setEditingPhoto] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        coverImage: ''
    });

    const handleCreateTrip = () => {
        if (!formData.name || !formData.startDate || !formData.endDate || !formData.location) return;

        const newTrip: Trip = {
            id: Date.now().toString(),
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            description: formData.description,
            coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
            photos: []
        };

        setTrips([...trips, newTrip]);
        setFormData({ name: '', startDate: '', endDate: '', location: '', description: '', coverImage: '' });
        setCurrentView('gallery');
    };

    const handleUpdateTrip = () => {
        if (!editingTrip) return;

        setTrips(trips.map(trip =>
            trip.id === editingTrip.id ? editingTrip : trip
        ));
        setEditingTrip(null);
        setCurrentView('gallery');
    };

    const handleDeleteTrip = (tripId: string) => {
        setTrips(trips.filter(trip => trip.id !== tripId));
        setCurrentView('gallery');
    };

    const handleAddPhoto = (tripId: string, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPhoto: Photo = {
                id: Date.now().toString(),
                url: e.target?.result as string,
                description: 'New photo'
            };

            setTrips(trips.map(trip =>
                trip.id === tripId
                    ? { ...trip, photos: [...trip.photos, newPhoto] }
                    : trip
            ));

            if (selectedTrip && selectedTrip.id === tripId) {
                setSelectedTrip({ ...selectedTrip, photos: [...selectedTrip.photos, newPhoto] });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFileUpload = (tripId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    handleAddPhoto(tripId, file);
                }
            });
        }
        // Reset the input so the same file can be selected again
        event.target.value = '';
    };

    const handleUpdatePhotoDescription = (tripId: string, photoId: string, description: string) => {
        setTrips(trips.map(trip =>
            trip.id === tripId
                ? {
                    ...trip,
                    photos: trip.photos.map(photo =>
                        photo.id === photoId ? { ...photo, description } : photo
                    )
                }
                : trip
        ));

        if (selectedTrip && selectedTrip.id === tripId) {
            setSelectedTrip({
                ...selectedTrip,
                photos: selectedTrip.photos.map(photo =>
                    photo.id === photoId ? { ...photo, description } : photo
                )
            });
        }
    };

    const handleDeletePhoto = (tripId: string, photoId: string) => {
        setTrips(trips.map(trip =>
            trip.id === tripId
                ? { ...trip, photos: trip.photos.filter(photo => photo.id !== photoId) }
                : trip
        ));

        if (selectedTrip && selectedTrip.id === tripId) {
            setSelectedTrip({
                ...selectedTrip,
                photos: selectedTrip.photos.filter(photo => photo.id !== photoId)
            });
        }
    };

    // Gallery View
    if (currentView === 'gallery') {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">My Trips</h1>
                        <button
                            onClick={() => setCurrentView('create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Trip
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trips.map((trip) => (
                            <div
                                key={trip.id}
                                className="relative group cursor-pointer"
                                onClick={() => {
                                    setSelectedTrip(trip);
                                    setCurrentView('detail');
                                }}
                            >
                                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={trip.coverImage}
                                        alt={trip.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingTrip(trip);
                                            setCurrentView('edit');
                                        }}
                                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="font-semibold text-lg mb-1">{trip.name}</h3>
                                        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                                            <MapPin size={14} />
                                            {trip.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm opacity-90">
                                            <Calendar size={14} />
                                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Create Trip View
    if (currentView === 'create') {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Trip</h2>
                            <button
                                onClick={() => setCurrentView('gallery')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter trip name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter location"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                                <input
                                    type="url"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter image URL (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your trip"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleCreateTrip}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Create Trip
                                </button>
                                <button
                                    onClick={() => setCurrentView('gallery')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Edit Trip View
    if (currentView === 'edit' && editingTrip) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Trip</h2>
                            <button
                                onClick={() => setCurrentView('gallery')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
                                <input
                                    type="text"
                                    value={editingTrip.name}
                                    onChange={(e) => setEditingTrip({ ...editingTrip, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={editingTrip.startDate}
                                        onChange={(e) => setEditingTrip({ ...editingTrip, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={editingTrip.endDate}
                                        onChange={(e) => setEditingTrip({ ...editingTrip, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editingTrip.location}
                                    onChange={(e) => setEditingTrip({ ...editingTrip, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                                <input
                                    type="url"
                                    value={editingTrip.coverImage}
                                    onChange={(e) => setEditingTrip({ ...editingTrip, coverImage: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingTrip.description}
                                    onChange={(e) => setEditingTrip({ ...editingTrip, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleUpdateTrip}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Update Trip
                                </button>
                                <button
                                    onClick={() => handleDeleteTrip(editingTrip.id)}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Delete Trip
                                </button>
                                <button
                                    onClick={() => setCurrentView('gallery')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Trip Detail View
    if (currentView === 'detail' && selectedTrip) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="relative h-64">
                            <img
                                src={selectedTrip.coverImage}
                                alt={selectedTrip.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <button
                                onClick={() => setCurrentView('gallery')}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTrip.name}</h1>
                                <div className="flex items-center gap-4 text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {selectedTrip.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-gray-700">{selectedTrip.description}</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-900">Photos</h2>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileUpload(selectedTrip.id, e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id={`photo-upload-${selectedTrip.id}`}
                                        />
                                        <label
                                            htmlFor={`photo-upload-${selectedTrip.id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <Upload size={16} />
                                            Add Photos
                                        </label>
                                    </div>
                                </div>

                                {selectedTrip.photos.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Upload size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No photos yet. Upload some to capture your memories!</p>
                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleFileUpload(selectedTrip.id, e)}
                                                className="hidden"
                                                id={`empty-photo-upload-${selectedTrip.id}`}
                                            />
                                            <label
                                                htmlFor={`empty-photo-upload-${selectedTrip.id}`}
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Upload size={20} />
                                                Upload Your First Photos
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedTrip.photos.map((photo) => (
                                            <div key={photo.id} className="group relative">
                                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.description}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => handleDeletePhoto(selectedTrip.id, photo.id)}
                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                                <div className="mt-2">
                                                    {editingPhoto === photo.id ? (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={photo.description}
                                                                onChange={(e) => handleUpdatePhotoDescription(selectedTrip.id, photo.id, e.target.value)}
                                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                onBlur={() => setEditingPhoto(null)}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setEditingPhoto(null);
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => setEditingPhoto(null)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <Save size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p
                                                            className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                                                            onClick={() => setEditingPhoto(photo.id)}
                                                        >
                                                            {photo.description}
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
    }

    return null;
};

export default TripManager;