import React, { useEffect, useRef, useCallback, useState, memo } from "react";

/* ------------------------------------------------------------------ *
 *  BrushTransition                                                    *
 *                                                                     *
 *  A reusable component that transitions between two images using     *
 *  a canvas-drawn brushstroke reveal effect. The incoming image is    *
 *  progressively "painted" over the outgoing one with organic,        *
 *  randomised brush strokes that feel hand-done.                      *
 *                                                                     *
 *  Usage:                                                             *
 *    <BrushTransition                                                 *
 *      src={nextImageUrl}                                             *
 *      alt="photo title"                                              *
 *      width={800}                                                    *
 *      height={600}                                                   *
 *      duration={1400}                                                *
 *    />                                                               *
 *  Every time `src` changes the brush animation fires.                *
 * ------------------------------------------------------------------ */

interface BrushTransitionProps {
    /** URL of the image to display / transition to */
    src: string;
    alt?: string;
    /** Canvas width in CSS pixels (will be scaled for retina) */
    width: number;
    /** Canvas height in CSS pixels */
    height: number;
    /** Duration of the brush reveal in ms (default 1200) */
    duration?: number;
    /** Class to add to the wrapper */
    className?: string;
    /** Called when the transition is complete */
    onComplete?: () => void;
}

/**
 * Preload an image and return a promise that resolves with the HTMLImageElement.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

/**
 * Draw a single organic brush "dab" at (x, y).
 * Combines multiple offset ellipses to look like a real bristle brush.
 */
function drawBrushDab(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Main dab
    const bristles = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < bristles; i++) {
        const ox = (Math.random() - 0.5) * size * 0.6;
        const oy = (Math.random() - 0.5) * size * 0.3;
        const w = size * (0.5 + Math.random() * 0.6);
        const h = size * (0.15 + Math.random() * 0.25);

        ctx.beginPath();
        ctx.ellipse(ox, oy, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

const BrushTransition: React.FC<BrushTransitionProps> = memo(({ src, alt = "", width, height, duration = 1200, className = "", onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const [currentSrc, setCurrentSrc] = useState<string>("");
    const prevSrcRef = useRef<string>("");
    const isFirstRef = useRef(true);

    const runBrushReveal = useCallback(
        (newImg: HTMLImageElement, oldImg: HTMLImageElement | null) => {
            const canvas = canvasRef.current;
            const bgCanvas = bgCanvasRef.current;
            if (!canvas || !bgCanvas) return;

            const dpr = window.devicePixelRatio || 1;
            // Use the actual rendered size so the canvas fills its container
            const w = canvas.offsetWidth || width;
            const h = canvas.offsetHeight || height;

            // Size both canvases to match their rendered dimensions
            [canvas, bgCanvas].forEach((c) => {
                c.width = w * dpr;
                c.height = h * dpr;
            });

            const ctx = canvas.getContext("2d")!;
            const bgCtx = bgCanvas.getContext("2d")!;

            ctx.scale(dpr, dpr);
            bgCtx.scale(dpr, dpr);

            // Draw old image (or dark bg) on the background canvas
            if (oldImg) {
                bgCtx.drawImage(oldImg, 0, 0, w, h);
            } else {
                bgCtx.fillStyle = "#1A1412";
                bgCtx.fillRect(0, 0, w, h);
            }

            // Create an off-screen canvas with the new image
            const offscreen = document.createElement("canvas");
            offscreen.width = w * dpr;
            offscreen.height = h * dpr;
            const offCtx = offscreen.getContext("2d")!;
            offCtx.scale(dpr, dpr);
            offCtx.drawImage(newImg, 0, 0, w, h);

            // Draw old on main
            ctx.drawImage(bgCanvas, 0, 0, w, h);

            // Prepare brush strokes — pre-generate random paths
            const strokes: Array<{
                x: number;
                y: number;
                size: number;
                angle: number;
                t: number;
            }> = [];

            const totalStrokes = 120 + Math.floor(Math.random() * 60);
            for (let i = 0; i < totalStrokes; i++) {
                // Strokes sweep from a random edge to create a painterly feel
                const t = (i / totalStrokes) * 0.85 + Math.random() * 0.15;
                strokes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: 30 + Math.random() * 60,
                    angle: Math.random() * Math.PI * 2,
                    t, // normalised time (0-1) when this stroke should be revealed
                });
            }

            // Sort by time
            strokes.sort((a, b) => a.t - b.t);

            const start = performance.now();
            let lastStrokeIdx = 0;

            const animate = (now: number) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                // Draw strokes up to current progress
                ctx.globalCompositeOperation = "source-over";

                while (lastStrokeIdx < strokes.length && strokes[lastStrokeIdx].t <= progress) {
                    const s = strokes[lastStrokeIdx];

                    // Use the new image as the fill via clip
                    ctx.save();
                    ctx.beginPath();

                    // Create clip region shaped like brush dab
                    const bristles = 3 + Math.floor(Math.random() * 3);
                    for (let i = 0; i < bristles; i++) {
                        const ox = s.x + (Math.random() - 0.5) * s.size * 0.6;
                        const oy = s.y + (Math.random() - 0.5) * s.size * 0.3;
                        const bw = s.size * (0.5 + Math.random() * 0.6);
                        const bh = s.size * (0.15 + Math.random() * 0.25);
                        ctx.ellipse(ox, oy, bw, bh, s.angle + Math.random() * 0.5, 0, Math.PI * 2);
                    }

                    ctx.clip();
                    ctx.drawImage(offscreen, 0, 0, w * dpr, h * dpr, 0, 0, w, h);
                    ctx.restore();

                    lastStrokeIdx++;
                }

                // After all strokes: draw full new image to fill any gaps
                if (progress >= 1) {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.globalAlpha = 1;
                    ctx.drawImage(newImg, 0, 0, w, h);
                    onComplete?.();
                } else {
                    animRef.current = requestAnimationFrame(animate);
                }
            };

            cancelAnimationFrame(animRef.current);
            animRef.current = requestAnimationFrame(animate);
        },
        [width, height, duration, onComplete],
    );

    useEffect(() => {
        if (!src || src === currentSrc) return;

        let cancelled = false;

        (async () => {
            try {
                const newImg = await loadImage(src);
                if (cancelled) return;

                let oldImg: HTMLImageElement | null = null;
                if (prevSrcRef.current && !isFirstRef.current) {
                    try {
                        oldImg = await loadImage(prevSrcRef.current);
                    } catch {
                        /* ignore */
                    }
                }

                if (cancelled) return;

                if (isFirstRef.current) {
                    // First image: just draw directly (no brush)
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const dpr = window.devicePixelRatio || 1;
                        const w = canvas.offsetWidth || width;
                        const h = canvas.offsetHeight || height;
                        canvas.width = w * dpr;
                        canvas.height = h * dpr;
                        const ctx = canvas.getContext("2d")!;
                        ctx.scale(dpr, dpr);
                        ctx.drawImage(newImg, 0, 0, w, h);
                    }
                    isFirstRef.current = false;
                } else {
                    runBrushReveal(newImg, oldImg);
                }

                prevSrcRef.current = src;
                setCurrentSrc(src);
            } catch {
                /* image failed to load */
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [src, width, height, runBrushReveal, currentSrc]);

    useEffect(() => {
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div
            className={`brush-transition ${className}`.trim()}
            style={{ position: "relative", width: "100%", aspectRatio: `${width} / ${height}`, overflow: "hidden" }}
        >
            {/* Background canvas (old image) */}
            <canvas
                ref={bgCanvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                }}
                aria-hidden
            />
            {/* Main canvas (brush strokes reveal new image) */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                }}
                role="img"
                aria-label={alt}
            />
        </div>
    );
});

BrushTransition.displayName = "BrushTransition";

export default BrushTransition;
