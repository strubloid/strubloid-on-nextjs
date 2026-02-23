import React, { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import styles from "./Timeline.module.scss";
import ScrollIndicator from "./ScrollIndicator";
import TimelineJobs from "./TimelineJobs";
import TimelineMessages from "./TimelineMessages";

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
    const [activeItem, setActiveItem] = useState<TimelineItem | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const itemCount = items.length;

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

                <TimelineJobs
                    items={items}
                    title={title}
                    scrollYProgress={scrollYProgress}
                    onActiveItemChange={setActiveItem}
                    onBackgroundChange={setBackgroundUrl}
                />

                <TimelineMessages scrollYProgress={scrollYProgress} />
            </section>
        </>
    );
};

export default Timeline;
