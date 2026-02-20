import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
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

interface TimelineProps {
    items: TimelineItem[];
    title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, title = "Experience" }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");

    // Reverse items to show chronologically from oldest to newest (left to right)
    const sortedItems = [...items].reverse();

    // Map each timeline item to a random flickr photo
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
    React.useEffect(() => {
        if (sortedItems.length > 0 && photoMap[sortedItems[0].id] && !backgroundUrl) {
            setBackgroundUrl(photoMap[sortedItems[0].id]);
        }
    }, [photoMap, sortedItems, backgroundUrl]);

    // Track scroll progress of this section only
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Calculate which item is currently centered
    const centeredItemIndex = useTransform(scrollYProgress, [0, 1], [0, sortedItems.length - 1]);

    // Update background when centered item changes
    useMotionValueEvent(centeredItemIndex, "change", (value) => {
        const index = Math.round(value);
        if (sortedItems[index] && photoMap[sortedItems[index].id]) {
            setBackgroundUrl(photoMap[sortedItems[index].id]);
        }
    });

    // Calculate horizontal translation based on scroll progress
    const itemCount = sortedItems.length;
    const maxTranslate = -100 * (itemCount - 1);
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxTranslate}%`]);

    return (
        <section
            ref={sectionRef}
            className={styles["timeline-section"]}
            style={{
                height: `${400 + itemCount * 80}vh`,
            }}
        >
            {/* Sticky background image - stays centered during timeline */}
            <motion.div
                className={styles["timeline-background"]}
                style={{
                    backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
                }}
            />

            <div className={styles["timeline-header"]}>
                <h2>{title}</h2>
                <p className={styles["timeline-subtitle"]}>Scroll down to explore my journey →</p>
            </div>

            <motion.div
                className={styles["timeline-wrapper"]}
                style={{
                    x,
                }}
            >
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
                        {/* Year Label */}
                        <div className={styles["year-label"]}>{item.year}</div>

                        {/* Timeline Dot */}
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
                                            {item.skills.length > 5 && (
                                                <span className={`${styles["skill-tag"]} ${styles["more"]}`}>
                                                    +{item.skills.length - 5}
                                                </span>
                                            )}
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
            </motion.div>
        </section>
    );
};

export default Timeline;
