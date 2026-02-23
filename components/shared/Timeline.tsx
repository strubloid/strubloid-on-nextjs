import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    const messageWidth = 0.08;
    const startScroll = 0.33 + index * messageWidth;
    const endScroll = startScroll + messageWidth;

    const cleanText = text.replace(/"/g, "").trim();
    const words = cleanText.split(" ");

    const wordPairs: string[][] = [];
    for (let i = 0; i < words.length; i += 2) {
        wordPairs.push(words.slice(i, i + 2));
    }

    const pairDuration = messageWidth / (wordPairs.length + 1);

    const messageOpacity = useTransform(progress, [Math.max(0, startScroll - 0.02), startScroll, endScroll, Math.min(1, endScroll + 0.02)], [0, 1, 1, 0]);

    const opacity = useTransform([messageOpacity, isTimelineComplete], ([msgOp, timelineComplete]: any[]) => {
        return timelineComplete ? msgOp : 0;
    });

    return (
        <motion.div className={`${styles["message-item"]} ${isFinal ? styles["final"] : ""}`} style={{ opacity }}>
            <p>
                {wordPairs.map((pair, pairIndex) => {
                    const pairStartScroll = startScroll + pairIndex * pairDuration;

                    const pairOpacity = useTransform(progress, [pairStartScroll - 0.005, pairStartScroll, endScroll], [0, 1, 1]);

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
                threshold: 0.5, // Triggers when 50% of item is visible in viewport
            },
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, [photoMap]);

    // Observe all timeline items
    useEffect(() => {
        itemRefs.current.forEach((element) => {
            observerRef.current?.observe(element);
        });
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const itemCount = sortedItems.length;
    const maxTranslate = -100 * (itemCount - 1);
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `${maxTranslate}%`]);

    const timelineFinishThreshold = 0.38;
    const isTimelineComplete = useTransform(scrollYProgress, [timelineFinishThreshold, timelineFinishThreshold + 0.01], [false, true]);

    const activeItem = sortedItems.find((item) => item.id === activeId) || null;

    return (
        <>
            <ScrollIndicator />
            <section
                ref={sectionRef}
                className={styles["timeline-section"]}
                style={{
                    height: `${-30 + itemCount * 400}vh`,
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
                </div>

                <div className={styles["timeline-header"]}>
                    <h2>IT</h2>
                </div>

                <div className={styles["timeline-header"]}>
                    <h2>3.9</h2>
                </div>

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

                {/* Static Content Panel */}
                <TimelineContentPanel item={activeItem} />

                {/* Messages */}
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
