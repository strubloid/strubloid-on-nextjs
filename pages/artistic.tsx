import React from "react";
import type { GetStaticProps, NextPage } from "next";
import Art from "../components/homepage/Art";
import { getFlickrData } from "../lib/flickr";
import type { FlickrPhoto, FlickrAlbum } from "../lib/flickr";

interface ArtisticProps {
    flickrPhotos: FlickrPhoto[];
    flickrAlbums: FlickrAlbum[];
}

const Artistic: NextPage<ArtisticProps> = ({ flickrPhotos, flickrAlbums }) => {
    // Use photo at index 32 (33rd photo, 0-indexed)
    // const backgroundPhoto = flickrPhotos[32] || flickrPhotos[0];
    const backgroundPhoto = flickrPhotos[32];
    const backgroundImageUrl = backgroundPhoto?.url_l || backgroundPhoto?.url_c || "";

    return (
        <>
            <div className="artistic-page">
                {/* Background portrait matrix */}
                <div className="artistic-bg-matrix">
                    {flickrPhotos.slice(0, 12).map((photo) => (
                        <div key={photo.id} className="artistic-bg-matrix__item" style={{
                            backgroundImage: `url(${photo.url_z})`,
                        }} />
                    ))}
                </div>

                {/* Hero section */}
                <div className="artistic-hero" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                    <div className="artistic-hero__background" />
                    <div className="artistic-hero__content">
                        <h1 className="artistic-hero__title">Artistic Of Me</h1>
                        <p className="artistic-hero__subtitle">Photography &amp; Digital Art</p>
                    </div>
                </div>

                {/* Gallery section - full width */}
                <div className="artistic-gallery">
                    <Art photos={flickrPhotos} albums={flickrAlbums} />
                </div>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<ArtisticProps> = async () => {
    const flickrData = await getFlickrData();
    return {
        props: {
            flickrPhotos: flickrData.photos,
            flickrAlbums: flickrData.albums,
        },
        revalidate: 3600,
    };
};

export default Artistic;
