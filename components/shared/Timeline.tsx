import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

interface TimelineProps {
    items: TimelineItem[];
    title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, title = "Experience" }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Reverse items to show chronologically from oldest to newest (left to right)
    const sortedItems = [...items].reverse();

    // Track scroll progress of this section only
    // scrollYProgress: 0 when section top hits viewport top
    // scrollYProgress: 1 when section bottom hits viewport bottom
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Calculate horizontal translation based on scroll progress
    // With N items, we need to translate by -(N-1)*100% to show all
    const itemCount = sortedItems.length;
    const maxTranslate = -100 * (itemCount - 1);

    const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxTranslate}%`]);

    return (
        <section
            ref={sectionRef}
            style={{
                height: `${300 + itemCount * 50}vh`,
                position: "relative",
            }}
        >
            <div className={styles["timeline-header"]}>
                <h2>{title}</h2>
                <p className={styles["timeline-subtitle"]}>Scroll down to explore my journey →</p>
            </div>

            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                <motion.div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        x,
                    }}
                >
                    <div className={styles["timeline-container"]}>
                        <div className={styles["timeline-track"]}>
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
                </motion.div>
            </div>
        </section>
    );
};

export default Timeline;
