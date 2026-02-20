import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import styles from "./Timeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

export interface TimelineItem {
    id: string;
    year: number | string;
    title: string;
    company?: string;
    description: string;
    skills?: string[];
    highlights?: string[];
    position?: string;
    color?: string;
}

interface TimelineProps {
    items: TimelineItem[];
    title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, title = "Experience" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Reverse items to show chronologically from oldest to newest (left to right)
    const sortedItems = [...items].reverse();

    useEffect(() => {
        if (!containerRef.current || !trackRef.current) return;

        const container = containerRef.current;
        const track = trackRef.current;

        // Wait for DOM to stabilize
        const timer = setTimeout(() => {
            // Get scrollable distance - the actual max scroll position
            const maxScroll = track.scrollWidth - container.offsetWidth;

            if (maxScroll <= 0) return;

            // Get individual item width for snapping
            const items = track.querySelectorAll(`.${styles["timeline-item"]}`);
            const itemWidth = items.length > 0 ? (items[0] as HTMLElement).offsetWidth + 80 : 360; // item width + gap

            // Start with scroll position that allows viewing earliest items on left
            const startScroll = 0;
            gsap.set(container, { scrollLeft: startScroll });

            // Create smooth snap-scroll behavior (carousel-like)
            let proxy = { scroll: container.scrollLeft };
            let isScrolling = false;

            // Helper function to check if last item is centered on screen
            const isLastItemCentered = (): boolean => {
                const lastItem = track.querySelector(`.${styles["timeline-item"]}:last-child`) as HTMLElement;
                if (!lastItem) return false;

                const containerRect = container.getBoundingClientRect();
                const itemRect = lastItem.getBoundingClientRect();

                // Calculate center positions
                const containerCenter = containerRect.left + containerRect.width / 2;
                const itemCenter = itemRect.left + itemRect.width / 2;

                // Item is centered if within 60px of container center
                const isCentered = Math.abs(itemCenter - containerCenter) < 60;

                // Also check that item is visible (not cut off on right edge)
                const isVisible = itemRect.right > containerRect.right - 20;

                return isCentered && isVisible;
            };

            const handleWheel = (e: WheelEvent) => {
                // Skip if already animating or hovering over items
                if (isScrolling || hoveredId) return;

                // Check if last item is centered on screen
                const lastItemCentered = isLastItemCentered();

                // Block ALL vertical scrolling until 2025 is centered
                if (!lastItemCentered) {
                    e.preventDefault();
                    isScrolling = true;

                    const currentScroll = container.scrollLeft;
                    const direction = e.deltaY > 0 ? 1 : -1; // 1 for right, -1 for left
                    const scrollStep = itemWidth * 1.5; // Increased movement per scroll
                    const nextScroll = gsap.utils.clamp(0, maxScroll, currentScroll + direction * scrollStep);

                    gsap.to(proxy, {
                        scroll: nextScroll,
                        duration: 1.2,
                        ease: "power3.inOut",
                        onUpdate: () => {
                            container.scrollLeft = proxy.scroll;
                        },
                        onComplete: () => {
                            isScrolling = false;
                        },
                    });
                    return;
                }

                // Only allow downward scroll once 2025 is centered
                if (lastItemCentered && e.deltaY > 0) {
                    return; // Allow natural page scroll
                }

                // Still allow left scroll even when centered
                if (e.deltaY < 0) {
                    e.preventDefault();
                    isScrolling = true;

                    const currentScroll = container.scrollLeft;
                    const scrollStep = itemWidth * 1.5;
                    const nextScroll = gsap.utils.clamp(0, maxScroll, currentScroll - scrollStep);

                    gsap.to(proxy, {
                        scroll: nextScroll,
                        duration: 1.2,
                        ease: "power3.inOut",
                        onUpdate: () => {
                            container.scrollLeft = proxy.scroll;
                        },
                        onComplete: () => {
                            isScrolling = false;
                        },
                    });
                }
            };

            container.addEventListener("wheel", handleWheel, { passive: false });

            return () => {
                container.removeEventListener("wheel", handleWheel);
            };
        }, 200);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [sortedItems, hoveredId]);

    return (
        <div className={styles["timeline-section"]}>
            <div className={styles["timeline-header"]}>
                <h2>{title}</h2>
                <p className={styles["timeline-subtitle"]}>Scroll right to explore my journey →</p>
            </div>

            <div className={styles["timeline-container"]} ref={containerRef}>
                <div className={styles["timeline-track"]} ref={trackRef}>
                    {/* Year labels */}
                    <div className={styles["timeline-years"]}>
                        {sortedItems.map((item) => (
                            <div key={`year-${item.id}`} className={styles["year-label"]}>
                                {item.year}
                            </div>
                        ))}
                    </div>

                    {/* Timeline line */}
                    <div className={styles["timeline-line"]}></div>

                    {/* Timeline items */}
                    <div className={styles["timeline-items"]}>
                        {sortedItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={styles["timeline-item"]}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={
                                    {
                                        "--item-delay": `${index * 0.1}s`,
                                    } as React.CSSProperties
                                }
                            >
                                {/* Dot/Ball */}
                                <div
                                    className={`${styles["timeline-dot"]} ${hoveredId === item.id ? styles["active"] : ""}`}
                                    style={{
                                        backgroundColor: item.color || "#457B9D",
                                    }}
                                >
                                    <div className={styles["dot-pulse"]}></div>
                                </div>

                                {/* Detail Panel - appears on hover */}
                                <div className={`${styles["timeline-detail"]} ${hoveredId === item.id ? styles["show"] : ""}`}>
                                    <div className={styles["detail-inner"]}>
                                        <div className={styles["detail-year"]}>{item.year}</div>
                                        <h3 className={styles["detail-title"]}>{item.title}</h3>
                                        {item.company && <p className={styles["detail-company"]}>{item.company}</p>}
                                        {item.position && <p className={styles["detail-position"]}>{item.position}</p>}
                                        <p className={styles["detail-description"]}>{item.description}</p>

                                        {item.skills && item.skills.length > 0 && (
                                            <div className={styles["detail-skills"]}>
                                                <span className={styles["skills-label"]}>Skills:</span>
                                                <div className={styles["skills-list"]}>
                                                    {item.skills.slice(0, 5).map((skill, idx) => (
                                                        <span key={idx} className={styles["skill-tag"]}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {item.skills.length > 5 && <span className={`${styles["skill-tag"]} ${styles["more"]}`}>+{item.skills.length - 5}</span>}
                                                </div>
                                            </div>
                                        )}

                                        {item.highlights && item.highlights.length > 0 && (
                                            <div className={styles["detail-highlights"]}>
                                                <span className={styles["highlights-label"]}>Highlights:</span>
                                                <ul>
                                                    {item.highlights.slice(0, 2).map((highlight, idx) => (
                                                        <li key={idx}>{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
