import { useEffect } from "react";

/**
 * Advanced Matrix Effect - Inspired by iconic Matrix movie with cyberpunk aesthetics
 * Features:
 * - Multiple vibrant neon colors (cyan, magenta, purple, yellow, green)
 * - Glowing bloom effect with text-shadow
 * - Randomized vertical starting positions
 * - Horizontal drift/wave motion as characters fall
 * - Dynamic opacity and pulsing glow
 */
export function useMatrixFallChars() {
    useEffect(() => {
        const chars = ["0", "1"];

        // Cyberpunk neon color palette with glow intensity mapping
        const colorPalette = [
            { color: "#00ff00", glow: "rgba(0, 255, 0, 0.8)" }, // Matrix green
            { color: "#00ffff", glow: "rgba(0, 255, 255, 0.8)" }, // Cyan
            { color: "#ff00ff", glow: "rgba(255, 0, 255, 0.8)" }, // Magenta
            { color: "#ffff00", glow: "rgba(255, 255, 0, 0.7)" }, // Yellow
            { color: "#0080ff", glow: "rgba(0, 128, 255, 0.8)" }, // Blue
            { color: "#ff0080", glow: "rgba(255, 0, 128, 0.8)" }, // Hot pink
            { color: "#00ff80", glow: "rgba(0, 255, 128, 0.8)" }, // Neon green
            { color: "#ff8000", glow: "rgba(255, 128, 0, 0.7)" }, // Orange
        ];

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
                const colorData = colorPalette[Math.floor(Math.random() * colorPalette.length)];

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

                // Random starting Y offset (characters don't all start from the same line)
                const randomYStart = (Math.random() - 0.5) * height;

                // Set initial position around the element's perimeter
                charEl.style.position = "fixed";
                charEl.style.left = `${centerX + offsetX}px`;
                charEl.style.top = `${centerY + offsetY + randomYStart}px`;
                charEl.style.pointerEvents = "none";
                charEl.style.fontSize = "12px";
                charEl.style.fontFamily = "monospace";
                charEl.style.fontWeight = "bold";
                charEl.style.color = colorData.color;
                charEl.style.opacity = "0.35";
                charEl.style.zIndex = "1";
                charEl.style.whiteSpace = "nowrap";
                charEl.style.letterSpacing = "1px";
                charEl.style.mixBlendMode = "screen";

                // Apply subtle glowing bloom effect - less intense for background
                const glowColor = colorData.glow;
                charEl.style.textShadow = `
                    0 0 3px ${glowColor},
                    0 0 8px ${glowColor}
                `;

                document.body.appendChild(charEl);

                // Random delay before animation starts (0-300ms for more stagger)
                const randomDelay = Math.random() * 500;

                const startAnimationTimer = setTimeout(() => {
                    const startTime = performance.now();
                    const duration = 500; // Slightly longer for visible trail
                    const fallDistance = 8; // Longer fall for impressive effect

                    // Random horizontal drift amplitude (characters wave as they fall)
                    const driftAmplitude = (Math.random() - 0.5) * 40;
                    const driftFrequency = Math.random() * 0.002 + 0.002;

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-in for falling effect
                        const easeProgress = progress * progress;

                        // Calculate vertical position
                        const verticalPos = easeProgress * fallDistance;

                        // Add horizontal drift (wave motion)
                        const driftOffset = Math.sin(elapsed * driftFrequency) * driftAmplitude;

                        // Pulsing opacity - glow gets brighter/dimmer
                        const pulseOpacity = 0.5 - progress * 0.9 + Math.sin(elapsed * 0.003) * 0.1;

                        charEl.style.transform = `translate(${driftOffset}px, ${verticalPos}px)`;
                        charEl.style.opacity = String(Math.max(0, pulseOpacity));

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

            // Create continuous waves while hovering (every 150ms for dense cascading)
            const waveInterval = setInterval(() => {
                createCharacterWave(target);
            }, 150);

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
