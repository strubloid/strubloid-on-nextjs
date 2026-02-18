import React, { useState, useCallback, useEffect, useRef } from "react";
import BrushTransition from "../../shared/BrushTransition";
import type { FlickrPhoto } from "../../../lib/flickr";

interface FlickrGalleryProps {
    photos: FlickrPhoto[];
}

/**
 * FlickrGallery — manages the photostream slideshow with brushstroke
 * transitions between images, thumbnail strip, and keyboard navigation.
 */
const FlickrGallery: React.FC<FlickrGalleryProps> = ({ photos }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const thumbStripRef = useRef<HTMLDivElement>(null);

    const total = photos.length;
    const current = photos[activeIndex] ?? null;

    // ── Auto-play ────────────────────────────────────────────
    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 5000);
    }, [total]);

    useEffect(() => {
        if (isPlaying && total > 1) {
            startAutoPlay();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, startAutoPlay, total]);

    // ── Navigation ───────────────────────────────────────────
    const goTo = useCallback(
        (idx: number) => {
            setActiveIndex(idx);
            // Reset auto-play timer so full interval after manual nav
            if (isPlaying) startAutoPlay();
        },
        [isPlaying, startAutoPlay],
    );

    const prev = useCallback(() => goTo((activeIndex - 1 + total) % total), [activeIndex, total, goTo]);
    const next = useCallback(() => goTo((activeIndex + 1) % total), [activeIndex, total, goTo]);

    // ── Keyboard ─────────────────────────────────────────────
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            else if (e.key === "ArrowRight") next();
            else if (e.key === " ") {
                e.preventDefault();
                setIsPlaying((p) => !p);
            }
        };
        // Only listen when the gallery section is somewhat in view
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [prev, next]);

    // ── Scroll thumbnail strip to keep active visible ────────
    useEffect(() => {
        if (!thumbStripRef.current) return;
        const thumb = thumbStripRef.current.children[activeIndex] as HTMLElement | undefined;
        if (thumb) {
            thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [activeIndex]);

    if (total === 0) {
        return (
            <div className="flickr-gallery flickr-gallery--empty">
                <div className="flickr-gallery__empty-state">
                    <i className="now-ui-icons media-1_camera-compact" />
                    <p>No public photos yet — check back soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flickr-gallery">
            {/* ── Main viewer ──────────────────────────────── */}
            <div className="flickr-gallery__viewer">
                <BrushTransition src={current!.url_l || current!.url_c} alt={current!.title} width={900} height={600} duration={1300} className="flickr-gallery__canvas-wrap" />

                {/* Navigation arrows */}
                <button className="flickr-gallery__arrow flickr-gallery__arrow--prev" onClick={prev} aria-label="Previous photo">
                    <i className="now-ui-icons arrows-1_minimal-left" />
                </button>
                <button className="flickr-gallery__arrow flickr-gallery__arrow--next" onClick={next} aria-label="Next photo">
                    <i className="now-ui-icons arrows-1_minimal-right" />
                </button>

                {/* Play / Pause */}
                <button className="flickr-gallery__play-btn" onClick={() => setIsPlaying((p) => !p)} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
                    <i className={`now-ui-icons media-1_button-${isPlaying ? "pause" : "play"}`} />
                </button>

                {/* Photo info overlay */}
                <div className="flickr-gallery__info">
                    <h4 className="flickr-gallery__photo-title">{current!.title}</h4>
                    {current!.description && <p className="flickr-gallery__photo-desc">{current!.description}</p>}
                    <span className="flickr-gallery__counter">
                        {activeIndex + 1} / {total}
                    </span>
                </div>
            </div>

            {/* ── Thumbnail strip ──────────────────────────── */}
            <div className="flickr-gallery__thumbs" ref={thumbStripRef}>
                {photos.map((photo, idx) => (
                    <button
                        key={photo.id}
                        className={`flickr-gallery__thumb${idx === activeIndex ? " flickr-gallery__thumb--active" : ""}`}
                        onClick={() => goTo(idx)}
                        aria-label={`View ${photo.title}`}
                    >
                        <img src={photo.url_z} alt={photo.title} loading="lazy" draggable={false} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FlickrGallery;
