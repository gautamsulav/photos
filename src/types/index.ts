export interface Photo {
    id: string;
    description: string;
    filename: string;
    publicUrl: string;
}

export interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    photos: Photo[];
    coverImage: string;
    city: string;
    state: string;
    country: string;
    thumbnail: Photo;
}

export interface TripFormData {
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    coverImage: string;
    city: string;
    state: string;
    country: string,
}

export type ViewType = 'gallery' | 'detail' | 'create' | 'edit';