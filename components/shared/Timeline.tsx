import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import styles from "./Timeline.module.scss";
import ScrollIndicator from "./ScrollIndicator";
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

interface MessageItemProps {
    progress: any;
    index: number;
    text: string;
    isFinal?: boolean;
    isTimelineComplete?: any;
}

const MessageItem: React.FC<MessageItemProps> = ({ progress, index, text, isFinal, isTimelineComplete }) => {
    // Each message appears ONE AT A TIME, but only AFTER the timeline is complete
    // Each message is visible for ~8% of scroll progress, words reveal progressively
    const messageWidth = 0.08; // Each message visible for 8% of scroll
    const startScroll = 0.33 + index * messageWidth; // Start at 33% (when timeline is done)
    const endScroll = startScroll + messageWidth;

    // Clean text (remove quotes and extra spaces)
    const cleanText = text.replace(/"/g, "").trim();
    const words = cleanText.split(" ");

    // Group words in pairs (2 words at a time for smoother reveal)
    const wordPairs: string[][] = [];
    for (let i = 0; i < words.length; i += 2) {
        wordPairs.push(words.slice(i, i + 2));
    }

    // Slower reveal - each pair gets more scroll time
    const pairDuration = messageWidth / (wordPairs.length + 1);

    const messageOpacity = useTransform(progress, [Math.max(0, startScroll - 0.02), startScroll, endScroll, Math.min(1, endScroll + 0.02)], [0, 1, 1, 0]);

    // Only show message if timeline is complete
    const opacity = useTransform([messageOpacity, isTimelineComplete], ([msgOp, timelineComplete]: any[]) => {
        return timelineComplete ? msgOp : 0;
    });

    return (
        <motion.div className={`${styles["message-item"]} ${isFinal ? styles["final"] : ""}`} style={{ opacity }}>
            <p>
                {wordPairs.map((pair, pairIndex) => {
                    const pairStartScroll = startScroll + pairIndex * pairDuration;

                    const pairOpacity = useTransform(
                        progress,
                        [pairStartScroll - 0.005, pairStartScroll, endScroll],
                        [0, 1, 1], // Fade in, then stay visible until message ends
                    );

                    return (
                        <motion.span key={pairIndex} style={{ opacity: pairOpacity }}>
                            {pair.join(" ")}
                            {pairIndex < wordPairs.length - 1 ? " " : ""}
                        </motion.span>
                    );
                })}
            </p>
        </motion.div>
    );
};

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

    // Determine if the last timeline item is still visible
    // Timeline finishes at 63% scroll, messages show after that (starting from second message)
    const timelineFinishThreshold = 0.38;
    const isTimelineComplete = useTransform(scrollYProgress, [timelineFinishThreshold, timelineFinishThreshold + 0.01], [false, true]);

    return (
        <>
            <ScrollIndicator />
            <section
                ref={sectionRef}
                className={styles["timeline-section"]}
                style={{
                    height: `${-30 + itemCount * 150}vh`,
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
                                    {/* Top Left: Year + Company + Title */}
                                    <div className={styles["detail-header"]}>
                                        <div className={styles["detail-year"]}>{item.year}</div>
                                        {item.company && <p className={styles["detail-company"]}>{item.company}</p>}
                                        <h3 className={styles["detail-title"]}>{item.title}</h3>
                                    </div>

                                    {/* Top Right: Description + Position */}
                                    <div className={styles["detail-right"]}>
                                        {item.position && <p className={styles["detail-position"]}>{item.position}</p>}
                                        <p className={styles["detail-description"]}>{item.description}</p>
                                    </div>

                                    {/* Bottom Left: Skills */}
                                    {item.skills && item.skills.length > 0 && (
                                        <div className={styles["detail-bottom-left"]}>
                                            <div className={styles["detail-skills"]}>
                                                <span className={styles["skills-label"]}>Skills</span>
                                                <div className={styles["skills-list"]}>
                                                    {item.skills.slice(0, 6).map((skill, idx) => (
                                                        <span key={idx} className={styles["skill-tag"]}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {item.skills.length > 6 && <span className={`${styles["skill-tag"]} ${styles["more"]}`}>+{item.skills.length - 6}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bottom Right: Highlights */}
                                    {item.highlights && item.highlights.length > 0 && (
                                        <div className={styles["detail-bottom-right"]}>
                                            <div className={styles["detail-highlights"]}>
                                                <span className={styles["highlights-label"]}>Highlights</span>
                                                <ul>
                                                    {item.highlights.slice(0, 3).map((highlight, idx) => (
                                                        <li key={idx}>{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Messages in Timeline Gap - Appears after 2025 scrolls out */}
                <div className={styles["timeline-messages"]}>
                    <div className={styles["messages-container"]}>
                        <MessageItem
                            progress={scrollYProgress}
                            index={0}
                            text="IT is like a box for hackers, it will be a new mystery, that you will be having fun with it, Dance baby!"
                            isTimelineComplete={isTimelineComplete}
                        />
                        <MessageItem progress={scrollYProgress} index={1} text="Do you know I am more than just a number? Yeah!" isTimelineComplete={isTimelineComplete} />
                        <MessageItem
                            progress={scrollYProgress}
                            index={2}
                            text="I know how to read X amount of languages and... speak too!"
                            isTimelineComplete={isTimelineComplete}
                        />
                        <MessageItem progress={scrollYProgress} index={3} text="Even guitar lyrics can be spoken by my guitar Ambrosia!" isTimelineComplete={isTimelineComplete} />
                        <MessageItem progress={scrollYProgress} index={4} text="English, Portuguese..." isTimelineComplete={isTimelineComplete} />
                        <MessageItem progress={scrollYProgress} index={5} text="Recently... Italian" isTimelineComplete={isTimelineComplete} />
                        <MessageItem progress={scrollYProgress} index={6} text="Japanese curious!" isTimelineComplete={isTimelineComplete} />
                        <MessageItem progress={scrollYProgress} index={7} text="Yeah, this is the guy who will be working for you!" isTimelineComplete={isTimelineComplete} />
                        <MessageItem
                            progress={scrollYProgress}
                            index={8}
                            text="If you want to get more details, keep scrolling down"
                            isFinal={true}
                            isTimelineComplete={isTimelineComplete}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Timeline;
