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

            // ── 4 Japanese calligraphy ink brushstrokes ─────────────
            // Each stroke: thick body with fast-press start, ink-tip taper
            // at the end, heavy bristle jitter on both edges, and small
            // ink-drop splats that burst out near the edges.
            const STROKE_COUNT = 5;
            const STEPS = 10; // spine resolution

            interface InkStroke {
                topEdge: { x: number; y: number }[];
                bottomEdge: { x: number; y: number }[];
                splats: { t: number; x: number; y: number; rx: number; ry: number; rot: number }[];
                startT: number;
                endT: number;
            }

            // Width profile: rapid press at left, wide body, ink-tip taper at right
            const strokeWidth = (t: number, maxW: number) => {
                const rise = Math.min(1, t / 0.08); // very fast press
                const fall = Math.max(0, 1 - Math.pow(Math.max(0, t - 0.82) / 0.18, 0.45)); // organic ink-tip taper
                return maxW * rise * fall;
            };

            const strokes: InkStroke[] = Array.from({ length: STROKE_COUNT }, (_, i) => {
                const bandH = h / STROKE_COUNT;
                const cy = bandH * i + bandH * 0.5;
                const maxW = bandH * 1.45; // bold — overlaps neighbours
                // Slight diagonal so each stroke feels hand-done
                const tilt = (Math.random() - 0.5) * bandH * 0.35;
                const y1 = cy + tilt;
                const y2 = cy - tilt;

                const topEdge: InkStroke["topEdge"] = [];
                const bottomEdge: InkStroke["bottomEdge"] = [];

                for (let j = 0; j <= STEPS; j++) {
                    const t = j / STEPS;
                    const x = t * w;
                    const sy = y1 + (y2 - y1) * t;
                    const hw = strokeWidth(t, maxW) / 2;

                    // Three layers of jitter: large bristle clumps, medium splay, fine grain
                    const topJ = (Math.random() - 0.5) * hw * 0.55 + (Math.random() - 0.5) * hw * 0.2 + (Math.random() - 0.5) * hw * 0.06;
                    const botJ = (Math.random() - 0.5) * hw * 0.55 + (Math.random() - 0.5) * hw * 0.2 + (Math.random() - 0.5) * hw * 0.06;

                    topEdge.push({ x, y: sy - hw + topJ });
                    bottomEdge.push({ x, y: sy + hw + botJ });
                }

                // Ink-drop splats: small elongated blobs that burst off the stroke edges
                const splats: InkStroke["splats"] = Array.from({ length: 22 }, () => {
                    const t = 0.04 + Math.random() * 0.92;
                    const j = Math.floor(t * STEPS);
                    const hw = strokeWidth(t, maxW) / 2;
                    const sy = y1 + (y2 - y1) * t;
                    const sign = Math.random() > 0.5 ? -1 : 1;
                    return {
                        t,
                        x: topEdge[j].x + (Math.random() - 0.5) * 18,
                        y: sy + sign * hw + sign * Math.random() * hw * 0.45,
                        rx: 4 + Math.random() * 11,
                        ry: 2 + Math.random() * 5,
                        rot: Math.random() * Math.PI,
                    };
                });

                // Sequential timing: fast sweeps with visible gaps between strokes
                const startT = i * 0.22;
                const endT = startT + 0.32; // each stroke is quick & decisive

                return { topEdge, bottomEdge, splats, startT, endT };
            });

            const start = performance.now();

            const animate = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);

                // Every frame: reset to old image, then paint completed stroke regions
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(bgCanvas, 0, 0, w, h);

                for (const stroke of strokes) {
                    if (progress <= stroke.startT) continue;

                    const strokeP = Math.min((progress - stroke.startT) / (stroke.endT - stroke.startT), 1);
                    const stepsDone = Math.ceil(strokeP * STEPS);
                    if (stepsDone < 1) continue;

                    const revealX = stroke.topEdge[Math.min(stepsDone, STEPS)].x;

                    // ── Draw main stroke body ─────────────────────────────
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(stroke.topEdge[0].x, stroke.topEdge[0].y);
                    for (let i = 1; i <= stepsDone; i++) {
                        ctx.lineTo(stroke.topEdge[i].x, stroke.topEdge[i].y);
                    }
                    ctx.lineTo(stroke.bottomEdge[stepsDone].x, stroke.bottomEdge[stepsDone].y);
                    for (let i = stepsDone - 1; i >= 0; i--) {
                        ctx.lineTo(stroke.bottomEdge[i].x, stroke.bottomEdge[i].y);
                    }
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(offscreen, 0, 0, w, h);
                    ctx.restore();

                    // ── Draw ink-drop splats within the revealed region ───
                    for (const splat of stroke.splats) {
                        if (splat.x > revealX) continue;
                        ctx.save();
                        ctx.beginPath();
                        ctx.ellipse(splat.x, splat.y, splat.rx, splat.ry, splat.rot, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(offscreen, 0, 0, w, h);
                        ctx.restore();
                    }
                }

                if (progress >= 1) {
                    ctx.globalCompositeOperation = "source-over";
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
        <div className={`brush-transition ${className}`.trim()} style={{ position: "relative", width: "100%", aspectRatio: `${width} / ${height}`, overflow: "hidden" }}>
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
