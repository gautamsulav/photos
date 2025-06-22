// components/TripForm.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Trip, TripFormData } from '../../types/index.ts';

interface TripFormProps {
    mode: 'create' | 'edit';
    trip?: Trip | null;
    loading: boolean;
    onSubmit: (data: TripFormData | Partial<Trip> | Partial<TripFormData>) => void;
    onCancel: () => void;
    onDelete?: (id: string) => void;
}

export const TripForm: React.FC<TripFormProps> = ({
                                                      mode,
                                                      trip,
                                                      loading,
                                                      onSubmit,
                                                      onCancel,
                                                      onDelete,
                                                  }) => {
    const [formData, setFormData] = useState<TripFormData>({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        coverImage: '',
        city: '',
        state: '',
        country: 'USA',
    });

    useEffect(() => {
        if (mode === 'edit' && trip) {
            setFormData({
                name: trip.name,
                startDate: trip.startDate,
                endDate: trip.endDate,
                location: trip.location,
                description: trip.description,
                coverImage: trip.coverImage,
                city: trip.city,
                state: trip.state,
                country: 'USA',
            });
        }
    }, [mode, trip]);

    const handleSubmit = () => {
        if (!formData.name || !formData.startDate || !formData.endDate || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        if (mode === 'edit' && trip) {
            onSubmit({ ...trip, ...formData });
        } else {
            onSubmit(formData);
        }
    };

    const handleDelete = () => {
        if (mode === 'edit' && trip && onDelete) {
            if (window.confirm('Are you sure you want to delete this trip?')) {
                onDelete(trip.id);
            }
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trip Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter trip name"
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter location"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter city"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                            </label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter state"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter image URL (optional)"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe your trip"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                {loading ? 'Saving...' : mode === 'create' ? 'Create Trip' : 'Update Trip'}
                            </button>

                            {mode === 'edit' && onDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                                >
                                    Delete Trip
                                </button>
                            )}

                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};