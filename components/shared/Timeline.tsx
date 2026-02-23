import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Timeline.module.scss";
import ScrollIndicator from "./ScrollIndicator";
import TimelineMessages from "./TimelineMessages";
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

interface TimelineProps {
    items: TimelineItem[];
    title?: string;
}

// Static Content Panel Component
const TimelineContentPanel: React.FC<{ item: TimelineItem | null }> = ({ item }) => {
    if (!item) return null;

    return (
        <motion.div className={styles["timeline-content-panel"]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className={styles["content-header"]}>
                <div className={styles["content-year"]}>{item.year}</div>
                {item.company && <p className={styles["content-company"]}>{item.company}</p>}
                <h3 className={styles["content-title"]}>{item.title}</h3>
            </div>

            <div className={styles["content-right"]}>
                {item.position && <p className={styles["content-position"]}>{item.position}</p>}
                <p className={styles["content-description"]}>{item.description}</p>
            </div>

            {item.skills && item.skills.length > 0 && (
                <div className={styles["content-skills"]}>
                    <span className={styles["skills-label"]}>Skills</span>
                    <div className={styles["skills-list"]}>
                        {item.skills.map((skill, idx) => (
                            <span key={idx} className={styles["skill-tag"]}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {item.highlights && item.highlights.length > 0 && (
                <div className={styles["content-highlights"]}>
                    <span className={styles["highlights-label"]}>Highlights</span>
                    <ul>
                        {item.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

const Timeline: React.FC<TimelineProps> = ({ items, title = "Experience" }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");

    const sortedItems = [...items].reverse();

    const photoMap = useMemo(() => {
        const map: { [key: string]: string } = {};
        sortedItems.forEach((item) => {
            if (flickrData.photos && flickrData.photos.length > 0) {
                const randomPhoto = flickrData.photos[Math.floor(Math.random() * flickrData.photos.length)];
                map[item.id] = randomPhoto.url_l || randomPhoto.url_c || randomPhoto.url_z;
            }
        });
        return map;
    }, []);

    // Initialize background with first item's photo
    useEffect(() => {
        if (sortedItems.length > 0 && photoMap[sortedItems[0].id] && !backgroundUrl) {
            setBackgroundUrl(photoMap[sortedItems[0].id]);
        }
    }, [photoMap, sortedItems, backgroundUrl]);

    // Setup Intersection Observer for 50% viewport threshold
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

                if (intersectingEntries.length > 0) {
                    const itemId = intersectingEntries[0].target.getAttribute("data-item-id");
                    if (itemId) {
                        setActiveId(itemId);
                        // Update background for active item
                        if (photoMap[itemId]) {
                            setBackgroundUrl(photoMap[itemId]);
                        }
                    }
                } else {
                    // Clear active item when no items are in viewport
                    setActiveId(null);
                }
            },
            {
                root: null,
                threshold: 0.1, // Triggers when 10% of item is visible (more reliable detection)
            },
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, [photoMap]);

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

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const itemCount = sortedItems.length;
    const maxTranslate = -100 * (itemCount - 1);
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxTranslate}%`]);

    const activeItem = sortedItems.find((item) => item.id === activeId) || null;

    return (
        <>
            <ScrollIndicator />
            {/* Static Content Panel - Rendered outside section for proper fixed positioning */}
            <TimelineContentPanel item={activeItem} />
            <section
                ref={sectionRef}
                className={styles["timeline-section"]}
                style={{
                    height: `${-30 + itemCount * 1000}vh`,
                }}
            >
                {/* Sticky background image */}
                <motion.div
                    className={styles["timeline-background"]}
                    style={{
                        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
                    }}
                />

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

                <TimelineMessages scrollYProgress={scrollYProgress} />
            </section>
        </>
    );
};

export default Timeline;
