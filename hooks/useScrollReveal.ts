import { useEffect, useRef, useCallback } from "react";

interface ScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    staggerDelay?: number;
}

/**
 * Hook that adds scroll-reveal animations to child elements.
 * Add `data-reveal` attribute to elements you want to animate.
 * Optionally add `data-reveal-delay="200"` for custom stagger delays.
 *
 * Animation types via data-reveal value:
 * - "fade-up" (default)
 * - "fade-left"
 * - "fade-right"
 * - "fade-scale"
 * - "fade-rotate"
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: ScrollRevealOptions = {}
) {
    const ref = useRef<T>(null);
    const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", staggerDelay = 120 } = options;

    const setupObserver = useCallback(() => {
        if (!ref.current) return;

        const elements = ref.current.querySelectorAll("[data-reveal]");
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = el.dataset.revealDelay
                            ? parseInt(el.dataset.revealDelay, 10)
                            : 0;

                        setTimeout(() => {
                            el.classList.add("revealed");
                        }, delay);

                        observer.unobserve(el);
                    }
                });
            },
            { threshold, rootMargin }
        );

        // Add stagger delays to siblings if not explicitly set
        let groupIndex = 0;
        let lastParent: Element | null = null;

        elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (el.parentElement !== lastParent) {
                groupIndex = 0;
                lastParent = el.parentElement;
            }
            if (!htmlEl.dataset.revealDelay) {
                htmlEl.dataset.revealDelay = String(groupIndex * staggerDelay);
            }
            groupIndex++;
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [threshold, rootMargin, staggerDelay]);

    useEffect(() => {
        // Slight delay to ensure DOM is painted
        const raf = requestAnimationFrame(() => {
            setupObserver();
        });
        return () => cancelAnimationFrame(raf);
    }, [setupObserver]);

    return ref;
}

export default useScrollReveal;
