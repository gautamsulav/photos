import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../types/index.ts'; // Assuming 'Photo' type is defined here and used for gallery images

// API Configuration (can be moved to a separate config file)
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080', // Update this URL as needed
    ENDPOINTS: {
        TRIPS: '/api/trips',
        PHOTOS: '/api/photos', // Endpoint to fetch all photos (e.g., paginated)
    },
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

// Helper function to construct full URLs
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Use the existing 'Photo' type from types/index.ts for gallery images
type GalleryImage = Photo;

const PhotoGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0); // Current page number for pagination
    const pageSize = 12; // Number of images per page

    // Fetch images from the backend
    const fetchMoreImages = useCallback(async (): Promise<void> => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate 800ms network delay

            const response = await fetch(`${getApiUrl(API_CONFIG.ENDPOINTS.PHOTOS)}?page=${page}&size=${pageSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const newImages: GalleryImage[] = data.content.map((photo: any) => ({
                id: photo.id,
                publicUrl: photo.publicUrl,
                description: photo.description,
            }));

            setImages(prevImages => [...prevImages, ...newImages]);
            setHasMore(!data.last);
            setPage(prevPage => prevPage + 1);

        } catch (err) {
            console.error("Failed to fetch images:", err);
            setError("Failed to load images. Please try again.");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, pageSize]);
    // Initial fetch on component mount
    useEffect(() => {
        fetchMoreImages();
    }, []); // Empty dependency array means this runs once on mount

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (loading || !hasMore || error) return;

        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Add this console log for debugging scroll behavior
        console.log(`Scroll: ${scrollTop}, Client: ${clientHeight}, ScrollHeight: ${scrollHeight}, Threshold: ${scrollHeight - 300}`);
        console.log(`Condition met: ${scrollTop + clientHeight >= scrollHeight - 300}`);

        if (scrollTop + clientHeight >= scrollHeight - 300) {
            console.log("Triggering fetchMoreImages due to scroll!");
            fetchMoreImages();
        }
    }, [fetchMoreImages, loading, hasMore, error]);

    // Set up scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const openFullscreen = (image: GalleryImage): void => {
        setSelectedImage(image);
    };

    const closeFullscreen = (): void => {
        setSelectedImage(null);
    };

    // Navigation for fullscreen images
    const navigateFullscreen = useCallback((direction: 'prev' | 'next') => {
        if (!selectedImage || images.length === 0) return;

        const currentIndex = images.findIndex(img => img.id === selectedImage.id);
        let nextIndex = -1;

        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % images.length;
        } else { // 'prev'
            nextIndex = (currentIndex - 1 + images.length) % images.length;
        }

        setSelectedImage(images[nextIndex]);
    }, [selectedImage, images]);

    // Keyboard navigation for fullscreen modal
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
    }, [selectedImage, navigateFullscreen, closeFullscreen]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>

            {error && (
                <div className="text-red-500 text-center text-lg mb-4">
                    {error}
                </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image: GalleryImage) => (
                    <div
                        key={image.id}
                        className="relative group cursor-pointer overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300"
                        onClick={() => openFullscreen(image)}
                    >
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={image.publicUrl} // Use publicUrl from backend data
                                alt={image.description ?? "Gallery image"} // Use description from backend data
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                                    View Full Size
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading more images...</span>
                </div>
            )}

            {/* End of results message */}
            {!hasMore && !loading && images.length > 0 && ( // Only show if there are images
                <div className="text-center py-8">
                    <p className="text-muted-foreground">You've reached the end of the gallery!</p>
                </div>
            )}

            {/* No photos message */}
            {!loading && images.length === 0 && !error && (
                <div className="text-center py-12 text-gray-500">
                    <p>No photos found in the gallery.</p>
                </div>
            )}


            {/* Fullscreen Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/[0.95] flex items-center justify-center p-8">
                    {/* Close button */}
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
                        aria-label="Close fullscreen view"
                    >
                        <X className="w-7 h-7" />
                    </button>

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => navigateFullscreen('prev')}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-7 h-7" />
                            </button>
                            <button
                                onClick={() => navigateFullscreen('next')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-200"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-7 h-7" />
                            </button>
                        </>
                    )}

                    {/* Modal content */}
                    <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage.publicUrl} // Use publicUrl
                            alt={selectedImage.description ?? "Gallery image"} // Use description
                            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-xl"
                        />

                        {/* Image caption */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-5 py-3 rounded-lg text-center">
                            {selectedImage.description ?? "No description"}
                        </div>
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeFullscreen}
                        aria-label="Click to close"
                        role="button"
                        tabIndex={0}
                    />
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;