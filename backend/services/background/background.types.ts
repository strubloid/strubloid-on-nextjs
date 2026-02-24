export interface BackgroundPhoto {
    id: string;
    url: string;
    title: string;
}

export interface BackgroundPhotos {
    timestamp: number;
    photos: BackgroundPhoto[];
}
