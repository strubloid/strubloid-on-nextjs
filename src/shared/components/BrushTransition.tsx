import React, { useEffect, useRef, useCallback, useState, memo, use } from "react";

/* ------------------------------------------------------------------ *
 *  BrushTransition                                                    *
 *                                                                     *
 *  Reveals the incoming image with a single Ensō-style ink circle    *
 *  (Japanese Zen circle brushstroke). The brush sweeps ~335° around  *
 *  a large circle, revealing the new image through the stroke path.  *
 *  When complete the full image is shown.                             *
 *                                                                     *
 *  Usage:                                                             *
 *    <BrushTransition                                                 *
 *      src={nextImageUrl}                                             *
 *      alt="photo title"                                              *
 *      width={800}                                                    *
 *      height={600}                                                   *
 *      duration={1400}                                                *
 *    />                                                               *
 *  Every time `src` changes the Ensō animation fires.                *
 * ------------------------------------------------------------------ */

interface BrushTransitionProps {
    /** URL of the image to display / transition to */
    src: string;
    alt?: string;
    /** Canvas width in CSS pixels (used for aspect-ratio only) */
    width: number;
    /** Canvas height in CSS pixels */
    height: number;
    /** Duration of the brush reveal in ms (default 1400) */
    duration?: number;
    /** Class to add to the wrapper */
    className?: string;
    /** Called when the transition is complete */
    onComplete?: () => void;
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

const BrushTransition: React.FC<BrushTransitionProps> = memo(({ src, alt = "", width, height, duration = 1400, className = "", onComplete }) => {
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
            const w = canvas.offsetWidth || width;
            const h = canvas.offsetHeight || height;

            [canvas, bgCanvas].forEach((c) => {
                c.width = w * dpr;
                c.height = h * dpr;
            });

            const ctx = canvas.getContext("2d")!;
            const bgCtx = bgCanvas.getContext("2d")!;
            ctx.scale(dpr, dpr);
            bgCtx.scale(dpr, dpr);

            // Background canvas: old image or dark fill
            if (oldImg) {
                bgCtx.drawImage(oldImg, 0, 0, w, h);
            } else {
                // --- New: blurred side extensions for portrait images ---
                // Fill with black first
                bgCtx.fillStyle = "#1A1412";
                bgCtx.fillRect(0, 0, w, h);
                // Only apply if portrait (or nearly square)
                const imgW = newImg.naturalWidth;
                const imgH = newImg.naturalHeight;
                if (imgW < imgH * 0.95) {
                    // Calculate blurred side width (e.g. 30% of canvas width each)
                    const sideW = Math.max((w - (imgW / imgH) * h) / 2, w * 0.15);
                    // Draw left blurred extension
                    bgCtx.save();
                    bgCtx.filter = "blur(32px) brightness(0.7)";
                    bgCtx.globalAlpha = 0.85;
                    bgCtx.drawImage(
                        newImg,
                        0, 0, imgW, imgH,
                        0, 0, sideW, h
                    );
                    bgCtx.restore();
                    // Draw right blurred extension
                    bgCtx.save();
                    bgCtx.filter = "blur(32px) brightness(0.7)";
                    bgCtx.globalAlpha = 0.85;
                    bgCtx.drawImage(
                        newImg,
                        0, 0, imgW, imgH,
                        w - sideW, 0, sideW, h
                    );
                    bgCtx.restore();
                }
            }

            // Off-screen canvas: new image ready to be revealed
            const offscreen = document.createElement("canvas");
            offscreen.width = w * dpr;
            offscreen.height = h * dpr;
            const offCtx = offscreen.getContext("2d")!;
            offCtx.scale(dpr, dpr);
            // Aspect-ratio aware draw for offscreen
            const imgW = newImg.naturalWidth;
            const imgH = newImg.naturalHeight;
            let drawW, drawH, offsetX, offsetY;
            if (imgW > imgH) {
                // Landscape: fit width, center vertically
                drawW = w;
                drawH = (imgH / imgW) * w;
                offsetX = 0;
                offsetY = (h - drawH) / 2;
            } else {
                // Portrait: fit height, center horizontally
                drawH = h;
                drawW = (imgW / imgH) * h;
                offsetX = (w - drawW) / 2;
                offsetY = 0;
            }
            offCtx.clearRect(0, 0, w, h);
            offCtx.drawImage(newImg, offsetX, offsetY, drawW, drawH);

            // ── Ensō geometry ────────────────────────────────────────
            // Single large circle stroke (like a Zen ink circle).
            // Starts at ~7-8 o'clock (traditional Ensō position) and
            // sweeps ~335° clockwise, leaving a natural gap at the start.

            const STEPS = 500; // high resolution → smooth organic arc

            const cx = w / 2;
            const cy = h / 2;
            // Radius: large enough to fill most of the frame
            const radius = Math.min(w, h) * 0.7;
            // Stroke half-width — very bold, like a real Ensō (~20% of shorter dim total)
            const maxHalfW = Math.min(w, h) * 0.2;

            // 210° in canvas coords = 7-8 o'clock (y-axis points down)
            const startAngle = (320 * Math.PI) / 180;
            const sweepAngle = (1800 * Math.PI) / 180;

            // Width profile: sin(π·t)^0.25
            //   → rises very rapidly to near-full width (first ~5% of arc)
            //   → stays thick for almost the entire circle
            //   → drops rapidly to a pointed tip at the very end
            // This matches the classic Ensō shape exactly.
            const halfWidth = (t: number): number => maxHalfW * Math.pow(Math.sin(Math.PI * t), 0.45);

            interface Edge {
                x: number;
                y: number;
            }

            const outerEdge: Edge[] = [];
            const innerEdge: Edge[] = [];

            // Independent wave parameters per edge → organic, non-mirrored undulation
            const outerWaveFreq = 2.0 + Math.random() * 2.5;
            const innerWaveFreq = 2.0 + Math.random() * 2.5;
            const outerWavePhase = Math.random() * Math.PI * 2;
            const innerWavePhase = Math.random() * Math.PI * 2;

            for (let j = 0; j <= STEPS; j++) {
                const t = j / STEPS;
                const angle = startAngle + t * sweepAngle;

                // Point on the centre-line circle
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;

                // Radial outward normal
                const nx = Math.cos(angle);
                const ny = Math.sin(angle);

                const hw = halfWidth(t);

                // At tapered tips the two edges meet
                if (hw < 1.2) {
                    outerEdge.push({ x: px, y: py });
                    innerEdge.push({ x: px, y: py });
                    continue;
                }

                // Gentle sine undulation on each edge
                const outerWave = hw * 1.2 * Math.sin(t * outerWaveFreq * Math.PI + outerWavePhase);
                const innerWave = hw * 1.2 * Math.sin(t * innerWaveFreq * Math.PI + innerWavePhase);

                // Bristle spikes: 30% chance of a hair jutting outward,
                // otherwise very fine grain noise.
                const outerSpike = Math.random() < 0.4 ? Math.random() * hw * 0.65 : (Math.random() - 0.5) * hw * 0.09;
                const innerSpike = Math.random() < 0.4 ? Math.random() * hw * 0.65 : (Math.random() - 0.5) * hw * 0.09;

                outerEdge.push({
                    x: px + nx * (hw + outerWave + outerSpike),
                    y: py + ny * (hw + outerWave + outerSpike),
                });
                innerEdge.push({
                    x: px - nx * (hw + innerWave + innerSpike),
                    y: py - ny * (hw + innerWave + innerSpike),
                });
            }

            // Ink splats — concentrated near the stroke start and end,
            // where the brush presses down and lifts off (the Ensō gap area).
            interface Splat {
                x: number;
                y: number;
                rx: number;
                ry: number;
                rot: number;
                t: number;
            }
            const splats: Splat[] = Array.from({ length: 40 }, () => {
                // 60% near end, 40% near start (brush lifts with more splatter)
                const atEnd = Math.random() < 0.6;
                const t = atEnd ? 2.8 + Math.random() * 0.2 : Math.random() * 0.2;

                const angle = startAngle + t * sweepAngle;
                const hw = halfWidth(t);
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;
                const nx = Math.cos(angle);
                const ny = Math.sin(angle);
                const sign = Math.random() > 0.5 ? 1 : -1;

                return {
                    t,
                    x: px + nx * sign * (hw * 0.7 + Math.random() * hw * 1.3) + (Math.random() - 0.5) * 28,
                    y: py + ny * sign * (hw * 0.7 + Math.random() * hw * 1.3) + (Math.random() - 0.5) * 28,
                    rx: 3 + Math.random() * 15,
                    ry: 1.5 + Math.random() * 6,
                    rot: Math.random() * Math.PI,
                };
            });

            const startTime = performance.now();

            const animate = (now: number) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const stepsDone = Math.min(Math.ceil(progress * STEPS), STEPS);

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(bgCanvas, 0, 0, w, h);

                if (stepsDone >= 1) {
                    // ── Draw the Ensō arc body ─────────────────────────
                    // Clip to the ring polygon traced so far, then paint
                    // the new image through that clip region.
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outerEdge[0].x, outerEdge[0].y);
                    for (let i = 1; i <= stepsDone; i++) {
                        ctx.lineTo(outerEdge[i].x, outerEdge[i].y);
                    }
                    ctx.lineTo(innerEdge[stepsDone].x, innerEdge[stepsDone].y);
                    for (let i = stepsDone - 1; i >= 0; i--) {
                        ctx.lineTo(innerEdge[i].x, innerEdge[i].y);
                        ctx.lineTo(innerEdge[i].x, innerEdge[i].y);
                    }
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(offscreen, 0, 0, w, h);
                    ctx.restore();

                    // ── Ink splats within the revealed region ──────────
                    for (const splat of splats) {
                        if (splat.t > progress) continue;
                        ctx.save();
                        ctx.beginPath();
                        ctx.ellipse(splat.x, splat.y, splat.rx, splat.ry, splat.rot, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(offscreen, 0, 0, w, h);
                        ctx.restore();
                    }
                }

                if (progress >= 1) {
                    // Stroke complete — show the full new image
                    ctx.globalCompositeOperation = "source-over";
                    // Draw new image with aspect-ratio aware logic
                    if (imgW > imgH) {
                        // Landscape: fit width, center vertically
                        drawW = w;
                        drawH = (imgH / imgW) * w;
                        offsetX = 0;
                        offsetY = (h - drawH) / 2;
                    } else {
                        // Portrait: fit height, center horizontally
                        drawH = h;
                        drawW = (imgW / imgH) * h;
                        offsetX = (w - drawW) / 2;
                        offsetY = 0;
                    }
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(newImg, offsetX, offsetY, drawW, drawH);
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
                    // First image: draw directly, no animation
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const dpr = window.devicePixelRatio || 1;
                        const w = canvas.offsetWidth || width;
                        const h = canvas.offsetHeight || height;
                        canvas.width = w * dpr;
                        canvas.height = h * dpr;
                        const ctx = canvas.getContext("2d")!;
                        ctx.scale(dpr, dpr);
                        // --- Fix: draw image with aspect ratio preserved ---
                        const imgW = newImg.naturalWidth;
                        const imgH = newImg.naturalHeight;
                        let drawW, drawH, offsetX, offsetY;
                        if (imgW > imgH) {
                            // Landscape: fit width, center vertically
                            drawW = w;
                            drawH = (imgH / imgW) * w;
                            offsetX = 0;
                            offsetY = (h - drawH) / 2;
                        } else {
                            // Portrait: fit height, center horizontally
                            drawH = h;
                            drawW = (imgW / imgH) * h;
                            offsetX = (w - drawW) / 2;
                            offsetY = 0;
                        }
                        ctx.clearRect(0, 0, w, h);
                        ctx.drawImage(newImg, offsetX, offsetY, drawW, drawH);
                        // Set style based on image aspect
                        const aspect = imgW / imgH;
                        configureVerticalImage(canvas, aspect);
                    }
                    isFirstRef.current = false;
                } else {
                    runBrushReveal(newImg, oldImg);
                    // Optionally, configure both canvases after animation
                    const mainCanvas = canvasRef.current;
                    const bgCanvas = bgCanvasRef.current;
                    if (mainCanvas) configureVerticalImage(mainCanvas, newImg.naturalWidth / newImg.naturalHeight);
                    if (bgCanvas && oldImg) configureVerticalImage(bgCanvas, oldImg.naturalWidth / oldImg.naturalHeight);
                }

                prevSrcRef.current = src;
                setCurrentSrc(src);
                console.log("Configured vertical image fit");
            } catch {
                /* image failed to load */
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [src, width, height, runBrushReveal, currentSrc]);

    // Accept canvas and aspect as arguments
    const configureVerticalImage = useCallback((canvas: HTMLCanvasElement | null, aspect: number) => {
        if (!canvas) return;
        if (aspect < 0.75) {
            canvas.style.objectFit = "contain";
            canvas.style.background = "#222"; // Example: dark bg for portrait
        } else {
            canvas.style.objectFit = "cover";
            canvas.style.background = "#111"; // Example: different bg for landscape
        }
    }, []);

    useEffect(() => {
        // Keep the old effect for initial mount/resize
        const canvas = canvasRef.current;
        if (!canvas) return;
        const aspect = width / height;
        configureVerticalImage(canvas, aspect);
        console.log("Configured vertical image fit (effect)");
    }, [width, height, configureVerticalImage]);

    useEffect(() => {
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div className={`brush-transition ${className}`.trim()} style={{ position: "relative", width: "100%", aspectRatio: `${width} / ${height}`, overflow: "hidden" }}>
            {/* Background canvas (outgoing image) */}
            <canvas ref={bgCanvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "inherit" }} aria-hidden />
            {/* Main canvas — Ensō arc reveals incoming image */}
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "inherit" }} role="img" aria-label={alt} />
        </div>
    );
});

BrushTransition.displayName = "BrushTransition";

export default BrushTransition;
