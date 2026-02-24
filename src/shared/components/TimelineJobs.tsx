import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import styles from "./Timeline.module.scss";

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

interface TimelineJobsProps {
    items: TimelineItem[];
    title: string;
    scrollYProgress: MotionValue<number>;
    onActiveItemChange: (item: TimelineItem | null) => void;
    onBackgroundChange: (url: string) => void;
    backgroundPhotos?: Array<{ id: string; url: string; title: string }>;
}

const TimelineJobs: React.FC<TimelineJobsProps> = ({
    items,
    title,
    scrollYProgress,
    onActiveItemChange,
    onBackgroundChange,
    backgroundPhotos = [],
}) => {
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const photoMapRef = useRef<{ [key: string]: string }>({});
    const initialPhotoIndexRef = useRef<number | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);

    const sortedItems = useMemo(() => [...items].reverse(), [items]);

    // Create photo map with unique assignments, ensuring first item gets a different photo than initial
    const photoMap = useMemo(() => {
        if (Object.keys(photoMapRef.current).length === 0 && backgroundPhotos && backgroundPhotos.length > 0) {
            const map: { [key: string]: string } = {};
            const usedIndices = new Set<number>();

            sortedItems.forEach((item, index) => {
                let randomIndex = Math.floor(Math.random() * backgroundPhotos.length);
                let attempts = 0;

                // For first item, avoid the initial load photo
                while ((usedIndices.has(randomIndex) || (index === 0 && randomIndex === initialPhotoIndexRef.current)) && attempts < 5) {
                    randomIndex = Math.floor(Math.random() * backgroundPhotos.length);
                    attempts++;
                }

                usedIndices.add(randomIndex);
                map[item.id] = backgroundPhotos[randomIndex].url;
            });

            photoMapRef.current = map;
        }
        return photoMapRef.current;
    }, [sortedItems, backgroundPhotos]);

    // Initialize background with a random photo on mount
    useEffect(() => {
        if (!initialPhotoIndexRef.current && backgroundPhotos && backgroundPhotos.length > 0) {
            const randomIndex = Math.floor(Math.random() * backgroundPhotos.length);
            initialPhotoIndexRef.current = randomIndex;
            onBackgroundChange(backgroundPhotos[randomIndex].url);
        }
    }, [onBackgroundChange, backgroundPhotos]);

    // Setup effect to track which item is closest to center
    useEffect(() => {
        const handleCenterCheck = () => {
            const centerX = window.innerWidth / 2;
            let result: { item: TimelineItem | null; distance: number } = { item: null, distance: Infinity };

            itemRefs.current.forEach((element: HTMLDivElement, id: string) => {
                const rect = element.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const distance = Math.abs(itemCenterX - centerX);

                if (distance < result.distance) {
                    const foundItem = sortedItems.find((item) => item.id === id);
                    if (foundItem) {
                        result = { item: foundItem, distance };
                    }
                }
            });

            // Only activate if item is reasonably close to center (within 30% of viewport width)
            if (result.distance < window.innerWidth * 0.3 && result.item) {
                const itemId = result.item.id;
                setActiveId(itemId);
                onActiveItemChange(result.item);
                // Update background for active item
                if (photoMap[itemId]) {
                    onBackgroundChange(photoMap[itemId]);
                }
            } else {
                // Clear active item if no item is close enough to center
                setActiveId(null);
                onActiveItemChange(null);
            }
        };

        // Check on scroll
        const scrollHandler = () => {
            requestAnimationFrame(handleCenterCheck);
        };

        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, [sortedItems, onActiveItemChange, onBackgroundChange, photoMap]);

    // Observe all timeline items
    useEffect(() => {
        // Unobserve all previous items
        itemRefs.current.forEach((element) => {
            observerRef.current?.unobserve(element);
        });
        // Re-observe all items when they change
        itemRefs.current.forEach((element) => {
            observerRef.current?.observe(element);
        });
    }, [sortedItems]);

    const itemCount = sortedItems.length;
    const maxTranslate = -100 * (itemCount - 1);
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxTranslate}%`]);

    return (
        <>
            <div className={styles["timeline-header"]}>
                <h2>{title}</h2>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>

                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>

            <div className={styles["timeline-header"]}>
                <h2>IT</h2>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>

            <div className={styles["timeline-header"]}>
                <h2>3.9</h2>
            </div>

            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>

            <motion.div
                className={styles["timeline-wrapper"]}
                style={{
                    x,
                }}
                transition={{ duration: 0.5 }}
            >
                {sortedItems.map((item, index) => (
                    <div
                        key={item.id}
                        data-item-id={item.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(item.id, el);
                        }}
                        className={styles["timeline-item"]}
                        style={
                            {
                                "--item-delay": `${index * 0.1}s`,
                            } as React.CSSProperties
                        }
                    >
                        {/* Year Label */}
                        <div className={styles["year-label"]}>{item.year}</div>

                        {/* Timeline Dot */}
                        <div
                            className={`${styles["timeline-dot"]} ${activeId === item.id ? styles["active"] : ""}`}
                            style={{
                                backgroundColor: item.color || "#457B9D",
                            }}
                        >
                            <div className={styles["dot-pulse"]}></div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </>
    );
};

export default TimelineJobs;
