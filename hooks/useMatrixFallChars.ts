import { useEffect } from "react";

/**
 * Matrix falling characters (0 and 1) on hover
 * Creates and animates text elements that fall 10px below the hovered element
 */
export function useMatrixFallChars() {
    useEffect(() => {
        const chars = ["0", "1"];
        const interactiveSelectors = "a, button, .btn, .nav-link, .dropdown-toggle, .card, input[type='button'], input[type='submit']";

        const createCharacterWave = (target: HTMLElement) => {
            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const width = rect.width;
            const height = rect.height;

            // Create characters distributed around the element's perimeter
            const count = Math.max(16, Math.round(width / 8));

            for (let i = 0; i < count; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];

                // Create character element
                const charEl = document.createElement("span");
                charEl.className = "matrix-char-fall";
                charEl.textContent = char;

                // Distribute characters evenly around the perimeter
                const angle = (i / count) * Math.PI * 2;
                const radiusX = width / 2 + 8;
                const radiusY = height / 2 + 8;

                const offsetX = Math.cos(angle) * radiusX;
                const offsetY = Math.sin(angle) * radiusY;

                // Set initial position around the element's perimeter
                charEl.style.position = "absolute";
                charEl.style.left = `${centerX + offsetX}px`;
                charEl.style.top = `${centerY + offsetY}px`;
                charEl.style.pointerEvents = "none";
                charEl.style.fontSize = "12px";
                charEl.style.fontFamily = "monospace";
                charEl.style.fontWeight = "bold";
                charEl.style.color = Math.random() > 0.6 ? "#2d9b55" : "#e8b631";
                charEl.style.opacity = "0.8";
                charEl.style.zIndex = "10000";
                charEl.style.whiteSpace = "nowrap";

                document.body.appendChild(charEl);

                // Random delay before animation starts (0-200ms)
                const randomDelay = Math.random() * 200;

                const startAnimationTimer = setTimeout(() => {
                    const startTime = performance.now();
                    const duration = 3000; // Slower fall for visible trail
                    const fallDistance = 80; // Longer fall distance

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = progress * progress;

                        charEl.style.transform = `translateY(${easeProgress * fallDistance}px)`;
                        charEl.style.opacity = String(Math.max(0, 0.8 - progress * 0.8));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            charEl.remove();
                        }
                    };

                    requestAnimationFrame(animate);
                }, randomDelay);

                // Store timeout ID for cleanup
                (charEl as any).__timeoutId = startAnimationTimer;
            }
        };

        const onMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // Create first wave immediately
            createCharacterWave(target);

            // Create continuous waves while hovering (every 150ms for cascading effect)
            const waveInterval = setInterval(() => {
                createCharacterWave(target);
            }, 800);

            // Store interval ID on the target for cleanup
            (target as any).__waveIntervalId = waveInterval;
        };

        const onMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // Stop creating new waves
            const intervalId = (target as any).__waveIntervalId;
            if (intervalId) {
                clearInterval(intervalId);
                delete (target as any).__waveIntervalId;
            }
        };

        // Use event delegation for all interactive elements
        const addListeners = () => {
            const elements = document.querySelectorAll(interactiveSelectors);
            elements.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnter as EventListener);
                el.addEventListener("mouseleave", onMouseLeave as EventListener);
            });
        };

        addListeners();

        // Watch for new elements being added to DOM
        const mutObserver = new MutationObserver(() => addListeners());
        mutObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            mutObserver.disconnect();
            document.querySelectorAll(interactiveSelectors).forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter as EventListener);
                el.removeEventListener("mouseleave", onMouseLeave as EventListener);
            });
        };
    }, []);
}

export default useMatrixFallChars;
