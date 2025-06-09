import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import type {GalleryImage} from "@/types.tsx";
// Image interface


// Dummy image URLs for the gallery - initial batch
const initialImages: GalleryImage[] = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        alt: "Mountain landscape"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
        alt: "Ocean sunset"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        alt: "Forest path"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        alt: "Mountain lake"
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        alt: "Desert dunes"
    },
    {
        id: 6,
        url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
        alt: "City skyline"
    },
    {
        id: 7,
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        alt: "Tropical beach"
    },
    {
        id: 8,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        alt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    }
];

// Simulate additional image batches
const getMoreImages = (currentCount: number): GalleryImage[] => {
    const moreImageUrls = [
        "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1445264918150-66a2371142fc?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1464822759844-d150baec93c5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1475924156734-496f6cac893c?w=800&h=600&fit=crop"
    ];

    const descriptions = [
        "Autumn forest",
        "Rocky coastline",
        "Prairie landscape",
        "Mountain peak",
        "River valley",
        "Sunset clouds",
        "Pine forest",
        "Alpine lake"
    ];

    return moreImageUrls.map((url, index) => ({
        id: currentCount + index + 1,
        url,
        alt: descriptions[index] || `Image ${currentCount + index + 1}`
    }));
};

const PhotoGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>(initialImages);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Simulate API call to fetch more images
    const fetchMoreImages = useCallback(async (): Promise<void> => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newImages = getMoreImages(images.length);

        // Simulate end of data after 40 images
        if (images.length >= 32) {
            setHasMore(false);
        } else {
            setImages(prevImages => [...prevImages, ...newImages]);
        }

        setLoading(false);
    }, [images.length, loading, hasMore]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;

        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Trigger load when user is 200px from bottom
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            fetchMoreImages();
        }
    }, [fetchMoreImages, loading, hasMore]);

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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>

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
                                src={image.url}
                                alt={image.alt}
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
            {!hasMore && !loading && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">You've reached the end of the gallery!</p>
                </div>
            )}

            {/* Fullscreen Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    {/* Close button */}
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
                        aria-label="Close fullscreen view"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Modal content */}
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />

                        {/* Image caption */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                            {selectedImage.alt}
                        </div>
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

export default PhotoGallery;