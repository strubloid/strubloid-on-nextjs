import React, { useState, useCallback, useEffect, useRef } from "react";
import { BrushTransition } from "@shared/components";
import type { FlickrPhoto } from "@lib/services/flickr";

interface FlickrGalleryProps {
    photos: FlickrPhoto[];
}

/**
 * FlickrGallery — manages the photostream slideshow with brushstroke
 * transitions between images, thumbnail strip, and keyboard navigation.
 *
 * Play/pause behaviour:
 *  - Auto-pauses when the gallery scrolls out of view (IntersectionObserver).
 *  - Resumes on mouse-enter ONLY if the user never manually paused it.
 *  - A manual pause (clicking the pause button) is sticky — scroll-back and
 *    hover will not resume it; only clicking play again will.
 */
const FlickrGallery: React.FC<FlickrGalleryProps> = ({ photos }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const thumbStripRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    // True only when the user explicitly clicked the pause button.
    // Hover and scroll-back will NOT resume if this is true.
    const manuallyPausedRef = useRef(false);
    const isInitialMountRef = useRef(true);

    const total = photos.length;
    const current = photos[activeIndex] ?? null;

    // ── Auto-play interval ───────────────────────────────────
    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 5000);
    }, [total]);

    useEffect(() => {
        if (isPlaying && total > 1) {
            startAutoPlay();
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, startAutoPlay, total]);

    // ── Scroll-away pause (IntersectionObserver) ─────────────
    // When the gallery leaves the viewport → pause.
    // When it comes back → do NOT auto-resume (hover is required).
    useEffect(() => {
        const el = galleryRef.current;
        if (!el || total <= 1) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    // Scrolled out — pause without marking as manually paused
                    setIsPlaying(false);
                }
                // Scrolled back in → intentionally do nothing;
                // the user must hover to resume (see handleMouseEnter).
            },
            { threshold: 0.15 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [total]);

    // ── Hover → resume (only if not manually paused) ─────────
    const handleMouseEnter = useCallback(() => {
        if (!manuallyPausedRef.current && total > 1) {
            setIsPlaying(true);
        }
    }, [total]);

    // ── Play / Pause button ───────────────────────────────────
    // Clicking pause marks it as manually paused (sticky).
    // Clicking play clears the sticky flag.
    const handleTogglePlay = useCallback(() => {
        setIsPlaying((prev) => {
            const next = !prev;
            manuallyPausedRef.current = !next; // pausing → sticky; playing → clear
            return next;
        });
    }, []);

    // ── Navigation ───────────────────────────────────────────
    const goTo = useCallback(
        (idx: number) => {
            setActiveIndex(idx);
            if (isPlaying) startAutoPlay(); // reset timer after manual nav
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
                handleTogglePlay();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [prev, next, handleTogglePlay]);

    // ── Scroll thumbnail strip to keep active thumb visible ──
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            return;
        }
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
        <div className="flickr-gallery" ref={galleryRef} onMouseEnter={handleMouseEnter}>
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
                <button className="flickr-gallery__play-btn" onClick={handleTogglePlay} aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}>
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
                        <img src={photo.url_z} alt={photo.title} draggable={false} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FlickrGallery;
