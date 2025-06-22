// components/GalleryView.tsx
import React from 'react';
import { Plus, Edit2, Calendar, MapPin } from 'lucide-react';
import type { Trip } from '../../types/index.ts';

interface GalleryViewProps {
    trips: Trip[];
    loading: boolean;
    error: string | null;
    onCreateTrip: () => void;
    onEditTrip: (trip: Trip) => void;
    onViewTrip: (trip: Trip) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
                                                            trips,
                                                            loading,
                                                            error,
                                                            onCreateTrip,
                                                            onEditTrip,
                                                            onViewTrip,
                                                        }) => {
    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-white text-xl">Loading trips...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-red-400 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
    <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Trips</h1>
                <button
                    onClick={onCreateTrip}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20}/>
                    Add Trip
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className="relative group cursor-pointer"
                        onClick={() => onViewTrip(trip)}
                    >
                        <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={trip.thumbnail ? trip.thumbnail.publicUrl : ''}
                                alt={trip.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditTrip(trip);
                                }}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <Edit2 size={16}/>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3 className="font-semibold text-lg mb-1">{trip.name}</h3>
                                <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                                    <MapPin size={14}/>
                                    {trip.city + ', ' + trip.country}
                                </div>
                                <div className="flex items-center gap-2 text-sm opacity-90">
                                    <Calendar size={14}/>
                                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
        ;
};