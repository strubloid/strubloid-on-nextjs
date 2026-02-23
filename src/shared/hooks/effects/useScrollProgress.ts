import { useEffect, useRef } from "react";

/**
 * Scroll progress indicator — thin bar at the top of the page
 * that fills as the user scrolls down.
 */
export function useScrollProgress() {
    const barRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const bar = document.createElement("div");
        bar.className = "scroll-progress-bar";
        document.body.appendChild(bar);
        barRef.current = bar;

        const onScroll = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = `${progress}%`;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            bar.remove();
        };
    }, []);
}

export default useScrollProgress;
