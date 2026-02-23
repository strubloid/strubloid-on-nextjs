import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import styles from "./Timeline.module.scss";
import flickrData from "../../data/flickr.json";

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
}

const TimelineJobs: React.FC<TimelineJobsProps> = ({
    items,
    title,
    scrollYProgress,
    onActiveItemChange,
    onBackgroundChange,
}) => {
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);

    const sortedItems = useMemo(() => [...items].reverse(), [items.length]);

    const photoMap = useMemo(() => {
        const map: { [key: string]: string } = {};
        sortedItems.forEach((item) => {
            if (flickrData.photos && flickrData.photos.length > 0) {
                const randomPhoto = flickrData.photos[Math.floor(Math.random() * flickrData.photos.length)];
                map[item.id] = randomPhoto.url_l || randomPhoto.url_c || randomPhoto.url_z;
            }
        });
        return map;
    }, [items.length]);

    // Initialize background with first item's photo on mount (only once)
    useEffect(() => {
        if (sortedItems.length > 0 && Object.keys(photoMap).length > 0 && photoMap[sortedItems[0].id]) {
            onBackgroundChange(photoMap[sortedItems[0].id]);
        }
    }, [photoMap]);

    // Setup effect to track which item is closest to center
    useEffect(() => {
        const handleCenterCheck = () => {
            const centerX = window.innerWidth / 2;
            let closestItem: TimelineItem | null = null;
            let closestDistance = Infinity;

            itemRefs.current.forEach((element: HTMLDivElement, id: string) => {
                const rect = element.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const distance = Math.abs(itemCenterX - centerX);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = sortedItems.find((item) => item.id === id) || null;
                }
            });

            // Only activate if item is reasonably close to center (within 30% of viewport width)
            if (closestDistance < window.innerWidth * 0.3) {
                const itemId = closestItem?.id;
                setActiveId(itemId || null);
                onActiveItemChange(closestItem);
                // Update background for active item
                if (closestItem && photoMap[itemId]) {
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
