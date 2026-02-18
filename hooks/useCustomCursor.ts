import { useEffect, useRef } from "react";

/**
 * Custom cursor effect — shows a glowing dot that follows the mouse
 * with a trailing circle for a premium organic feel.
 */
export function useCustomCursor() {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create cursor elements
        const dot = document.createElement("div");
        dot.className = "custom-cursor-dot";
        document.body.appendChild(dot);
        dotRef.current = dot;

        const circle = document.createElement("div");
        circle.className = "custom-cursor-circle";
        document.body.appendChild(circle);
        circleRef.current = circle;

        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        const onMouseDown = () => {
            dot.classList.add("cursor-click");
            circle.classList.add("cursor-click");
        };

        const onMouseUp = () => {
            dot.classList.remove("cursor-click");
            circle.classList.remove("cursor-click");
        };

        const onMouseEnterLink = () => {
            dot.classList.add("cursor-hover");
            circle.classList.add("cursor-hover");
        };

        const onMouseLeaveLink = () => {
            dot.classList.remove("cursor-hover");
            circle.classList.remove("cursor-hover");
        };

        // Animate the trailing circle
        let animId: number;
        const animate = () => {
            circleX += (mouseX - circleX) * 0.15;
            circleY += (mouseY - circleY) * 0.15;
            circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;
            animId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        animId = requestAnimationFrame(animate);

        // Add hover effects to interactive elements
        const addLinkListeners = () => {
            const links = document.querySelectorAll("a, button, .btn, .nav-link, .dropdown-toggle, .card");
            links.forEach((link) => {
                link.addEventListener("mouseenter", onMouseEnterLink);
                link.addEventListener("mouseleave", onMouseLeaveLink);
            });
        };

        // Initial + mutation observer for dynamic elements
        addLinkListeners();
        const mutObserver = new MutationObserver(() => addLinkListeners());
        mutObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            cancelAnimationFrame(animId);
            mutObserver.disconnect();
            dot.remove();
            circle.remove();
        };
    }, []);
}

export default useCustomCursor;
