import { useEffect, useRef, useCallback } from "react";

/**
 * Characters used for the matrix rain — mix of katakana, latin, digits & symbols
 * to get that authentic Matrix feel.
 */
const MATRIX_CHARS =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\";

interface MatrixRevealOptions {
    /** IntersectionObserver threshold (default 0.15) */
    threshold?: number;
    /** Root margin for the observer */
    rootMargin?: string;
    /** How long the matrix rain runs before resolving to content (ms) */
    matrixDuration?: number;
    /** Stagger delay between sibling cards (ms) */
    staggerDelay?: number;
    /** Column color — CSS color string */
    color?: string;
    /** Font size for the matrix characters (px) */
    fontSize?: number;
}

/**
 * Hook that creates a Matrix-rain reveal effect on `.skill-card` elements.
 *
 * When a card enters the viewport a <canvas> overlay starts drawing falling
 * green characters.  After `matrixDuration` ms the canvas fades out and the
 * card content fades in.  When the card leaves (reversible) the process
 * reverses — content fades, matrix briefly re-appears, then the card hides.
 */
export function useMatrixReveal<T extends HTMLElement = HTMLDivElement>(
    options: MatrixRevealOptions = {}
) {
    const ref = useRef<T>(null);
    const {
        threshold = 0.12,
        rootMargin = "0px 0px -40px 0px",
        matrixDuration = 1200,
        staggerDelay = 180,
        color = "#2D9B55",
        fontSize = 13,
    } = options;

    // Keep mutable map of per-card state so we can cancel on un-intersect
    const cardStateRef = useRef<
        Map<
            HTMLElement,
            { animId: number | null; timeout: ReturnType<typeof setTimeout> | null; canvas: HTMLCanvasElement | null }
        >
    >(new Map());

    /** Create & attach a <canvas> that covers the card */
    const createCanvas = useCallback(
        (card: HTMLElement): HTMLCanvasElement => {
            const canvas = document.createElement("canvas");
            canvas.className = "matrix-canvas";
            // Size to card
            const rect = card.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(dpr, dpr);
            card.appendChild(canvas);
            return canvas;
        },
        []
    );

    /** Run the matrix rain animation on a canvas */
    const runMatrix = useCallback(
        (canvas: HTMLCanvasElement, onDone: () => void) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return 0;

            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            const cols = Math.floor(w / fontSize);
            const drops: number[] = Array.from({ length: cols }, () =>
                Math.random() * -20
            );

            const startTime = performance.now();
            let animId = 0;

            const draw = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / matrixDuration, 1);

                // Gradually dim the whole canvas as we approach done
                ctx.fillStyle =
                    progress > 0.7
                        ? `rgba(26, 20, 18, ${0.12 + (progress - 0.7) * 2.5})`
                        : "rgba(26, 20, 18, 0.12)";
                ctx.fillRect(0, 0, w, h);

                // Intensity ramps up then down
                const intensity = progress < 0.3
                    ? progress / 0.3
                    : progress > 0.7
                        ? 1 - (progress - 0.7) / 0.3
                        : 1;

                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < cols; i++) {
                    if (Math.random() > 0.92 - intensity * 0.15) {
                        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                        const x = i * fontSize;
                        const y = drops[i] * fontSize;

                        // Mix green / gold / accent for the warm theme
                        const rnd = Math.random();
                        if (rnd > 0.92) {
                            ctx.fillStyle = `rgba(232, 182, 49, ${0.9 * intensity})`;  // gold
                        } else if (rnd > 0.85) {
                            ctx.fillStyle = `rgba(242, 160, 122, ${0.8 * intensity})`; // accent
                        } else {
                            ctx.fillStyle = `rgba(45, 155, 85, ${(0.6 + Math.random() * 0.4) * intensity})`; // green
                        }

                        ctx.fillText(char, x, y);
                        drops[i]++;
                    }

                    if (drops[i] * fontSize > h && Math.random() > 0.96) {
                        drops[i] = 0;
                    }
                }

                if (progress < 1) {
                    animId = requestAnimationFrame(draw);
                } else {
                    onDone();
                }
            };

            animId = requestAnimationFrame(draw);
            return animId;
        },
        [matrixDuration, fontSize, color]
    );

    const setupObserver = useCallback(() => {
        if (!ref.current) return;

        const cards = ref.current.querySelectorAll<HTMLElement>(".skill-card");
        if (cards.length === 0) return;

        const stateMap = cardStateRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const card = entry.target as HTMLElement;

                    if (entry.isIntersecting) {
                        // ── REVEAL ──
                        const delayStr = card.dataset.revealDelay;
                        const delay = delayStr ? parseInt(delayStr, 10) : 0;

                        // Cancel any pending hide
                        const prev = stateMap.get(card);
                        if (prev?.timeout) clearTimeout(prev.timeout);
                        if (prev?.animId) cancelAnimationFrame(prev.animId);
                        if (prev?.canvas) {
                            prev.canvas.remove();
                        }

                        const timeout = setTimeout(() => {
                            // Show the card shell (border, background) immediately
                            card.classList.add("matrix-active");

                            const canvas = createCanvas(card);
                            const animId = runMatrix(canvas, () => {
                                // Matrix done — reveal content
                                canvas.classList.add("matrix-canvas--fade");
                                card.classList.add("revealed");
                                // Remove canvas after its CSS fade
                                setTimeout(() => {
                                    canvas.remove();
                                    const s = stateMap.get(card);
                                    if (s) s.canvas = null;
                                }, 600);
                            });

                            stateMap.set(card, { animId, timeout: null, canvas });
                        }, delay);

                        stateMap.set(card, { animId: null, timeout, canvas: null });
                    } else {
                        // ── HIDE (reverse) ──
                        const prev = stateMap.get(card);
                        if (prev?.timeout) clearTimeout(prev.timeout);
                        if (prev?.animId) cancelAnimationFrame(prev.animId);
                        if (prev?.canvas) {
                            prev.canvas.remove();
                        }

                        // If the card was revealed, do a brief reverse matrix flash
                        if (card.classList.contains("revealed")) {
                            card.classList.remove("revealed");
                            card.classList.add("matrix-hiding");

                            const canvas = createCanvas(card);
                            const animId = runMatrix(canvas, () => {
                                canvas.classList.add("matrix-canvas--fade");
                                card.classList.remove("matrix-active", "matrix-hiding");
                                setTimeout(() => {
                                    canvas.remove();
                                    const s = stateMap.get(card);
                                    if (s) s.canvas = null;
                                }, 400);
                            });

                            stateMap.set(card, { animId, timeout: null, canvas });
                        } else {
                            card.classList.remove("matrix-active", "matrix-hiding");
                            stateMap.set(card, { animId: null, timeout: null, canvas: null });
                        }
                    }
                });
            },
            { threshold, rootMargin }
        );

        // Assign stagger delays & observe
        let groupIndex = 0;
        let lastParent: Element | null = null;

        cards.forEach((card) => {
            if (card.parentElement !== lastParent) {
                groupIndex = 0;
                lastParent = card.parentElement;
            }
            if (!card.dataset.revealDelay) {
                card.dataset.revealDelay = String(groupIndex * staggerDelay);
            }
            groupIndex++;
            observer.observe(card);
        });

        return () => {
            observer.disconnect();
            stateMap.forEach((s) => {
                if (s.animId) cancelAnimationFrame(s.animId);
                if (s.timeout) clearTimeout(s.timeout);
                if (s.canvas) s.canvas.remove();
            });
            stateMap.clear();
        };
    }, [threshold, rootMargin, staggerDelay, createCanvas, runMatrix]);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setupObserver();
        });
        return () => cancelAnimationFrame(raf);
    }, [setupObserver]);

    return ref;
}

export default useMatrixReveal;
