import { useEffect, useRef, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Available dramatic reveal animation types                          */
/* ------------------------------------------------------------------ */

const CARD_REVEAL_ANIMATIONS = [
    "fade-left",
    "fade-right",
    "fade-scale",
    "fade-rotate",
    "scatter-in",
    "flip-in",
    "slide-up-spring",
    "zoom-burst",
    "swing-in",
    "slide-right-spin",
] as const;

export type CardRevealAnimation = (typeof CARD_REVEAL_ANIMATIONS)[number];

interface UseCardRevealOptions {
    /** IntersectionObserver threshold (default: 0.12) */
    threshold?: number;
    /** Root margin for triggering earlier/later (default: "0px 0px -40px 0px") */
    rootMargin?: string;
    /** Base stagger delay in ms between cards (default: 150) */
    staggerDelay?: number;
    /** Subset of animations to pick from. Defaults to all. */
    animations?: CardRevealAnimation[];
}

/**
 * Reusable hook that assigns random reveal animations to `[data-card-reveal]` children.
 *
 * Usage:
 *   const ref = useCardReveal<HTMLDivElement>();
 *   <div ref={ref}>
 *       <div data-card-reveal>...</div>
 *       <div data-card-reveal>...</div>
 *   </div>
 *
 * Each card gets a random animation type from the pool plus a staggered delay.
 * Plug this into any section (Github, Resume, Portfolio, etc.)
 */
export function useCardReveal<T extends HTMLElement = HTMLDivElement>(options: UseCardRevealOptions = {}) {
    const ref = useRef<T>(null);
    const {
        threshold = 0.12,
        rootMargin = "0px 0px -40px 0px",
        staggerDelay = 150,
        animations = [...CARD_REVEAL_ANIMATIONS],
    } = options;

    // Generate a stable shuffled pool so animations don't change on re-render
    const pool = useMemo(() => {
        const shuffled = [...animations];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [animations]);

    const setup = useCallback(() => {
        if (!ref.current) return;

        const cards = ref.current.querySelectorAll<HTMLElement>("[data-card-reveal]");
        if (cards.length === 0) return;

        // Assign random animation + stagger to each card
        cards.forEach((card, idx) => {
            const anim = pool[idx % pool.length];
            card.setAttribute("data-reveal", anim);
            card.setAttribute("data-reveal-delay", String(idx * staggerDelay));
        });

        // Observe each card independently
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = parseInt(el.dataset.revealDelay || "0", 10);
                        setTimeout(() => el.classList.add("revealed"), delay);
                        observer.unobserve(el);
                    }
                });
            },
            { threshold, rootMargin },
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [pool, threshold, rootMargin, staggerDelay]);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setup());
        return () => cancelAnimationFrame(raf);
    }, [setup]);

    return ref;
}

export default useCardReveal;
