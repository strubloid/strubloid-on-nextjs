import React from "react";
import { Container } from "reactstrap";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import FlickrGallery from "./art/FlickrGallery";
import type { FlickrPhoto, FlickrAlbum } from "../../lib/flickr";

interface ArtProps {
    photos: FlickrPhoto[];
    albums: FlickrAlbum[];
}

const Art: React.FC<ArtProps> = ({ photos, albums }) => {
    const headerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

    return (
        <section className="homepage-art">
            <Container fluid>
                {/* ── Section header ──────────────────────────── */}
                <div className="art-header" ref={headerRef}>
                    <div className="art-header__inner">
                        <span className="art-header__accent" />
                        <span className="art-header__category">Creative Side</span>
                        <h2 className="art-header__title">Art &amp; Photography</h2>
                        <span className="art-header__accent" />
                    </div>
                </div>

                {/* ── Photostream gallery ─────────────────────── */}
                {photos.length > 0 && <FlickrGallery photos={photos} />}

                {/* ── Albums grid ─────────────────────────────── */}
                {albums.length > 0 && (
                    <div className="art-albums">
                        <h3 className="art-albums__heading">Albums</h3>
                        <div className="art-albums__grid">
                            {albums.map((album) => (
                                <a key={album.id} className="art-album-card" href={album.flickrUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="art-album-card__cover">
                                        <img src={album.coverUrl} alt={album.title} loading="lazy" />
                                        <span className="art-album-card__count">
                                            {album.photoCount} photo{album.photoCount !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div className="art-album-card__body">
                                        <h4 className="art-album-card__title">{album.title}</h4>
                                        {album.description && <p className="art-album-card__desc">{album.description}</p>}
                                    </div>
                                    <span className="art-album-card__link-icon">
                                        <i className="now-ui-icons ui-1_send" />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Empty state (no photos and no albums) ──── */}
                {photos.length === 0 && albums.length === 0 && (
                    <div className="art-empty">
                        <i className="now-ui-icons design_palette" />
                        <p>Gallery coming soon — stay tuned!</p>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default Art;
