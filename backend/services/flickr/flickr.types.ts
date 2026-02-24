/**
 * Flickr Service Types
 * Types for Flickr API integration and caching
 */

export interface FlickrPhoto {
    id: string;
    title: string;
    description: string;
    url_z: string; // 640px — medium
    url_c: string; // 800px — medium 800
    url_l: string; // 1024px — large
    url_o?: string; // original (may not exist)
    width_z: number;
    height_z: number;
    pageUrl: string; // link to flickr photo page
}

export interface FlickrAlbum {
    id: string;
    title: string;
    description: string;
    photoCount: number;
    coverUrl: string; // primary photo url
    flickrUrl: string; // link to album on flickr
}

export interface FlickrCache {
    timestamp: number;
    photos: FlickrPhoto[];
    albums: FlickrAlbum[];
}
