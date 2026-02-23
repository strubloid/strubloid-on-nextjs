import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import styles from "./Timeline.module.scss";

interface TimelineMessagesProps {
    scrollYProgress: MotionValue<number>;
}

const TimelineMessages: React.FC<TimelineMessagesProps> = ({ scrollYProgress }) => {
    const messages = [
        "IT is like a box for hackers, it will be a new mystery, that you will be having fun with it, Dance baby!",
        "Do you know I am more than just a number? Yeah!",
        "I know how to read X amount of languages and... speak too!",
        "Even guitar lyrics can be spoken by my guitar Ambrosia!",
        "English, Portuguese...",
        "Recently... Italian",
        "Japanese curious!",
        "Yeah, this is the guy who will be working for you!",
        "If you want to get more details, keep scrolling down",
    ];

    // Messages start after timeline-wrapper animation finishes (delayed to avoid overlap)
    const timelineFinishThreshold = 0.69;
    const messageWidth = (1 - timelineFinishThreshold) / messages.length;

    // Calculate current message index to only render visible message
    const currentMessageIndex = useTransform(scrollYProgress, (progress) => {
        if (progress < timelineFinishThreshold) return -1;
        const relativeProgress = progress - timelineFinishThreshold;
        const index = Math.floor(relativeProgress / messageWidth);
        return Math.min(index, messages.length - 1);
    });

    return (
        <div className={styles["timeline-messages"]}>
            {messages.map((message, index) => {
                const startScroll = timelineFinishThreshold + index * messageWidth;
                const endScroll = timelineFinishThreshold + (index + 1) * messageWidth;

                const opacity = useTransform(scrollYProgress, [startScroll, startScroll + 0.01, endScroll - 0.01, endScroll], [0, 1, 1, 0]);

                const shouldRender = useTransform(currentMessageIndex, (current) => current === index);

                return (
                    <motion.div
                        key={index}
                        className={`${styles["message-item"]} ${index === messages.length - 1 ? styles["final"] : ""}`}
                        style={{
                            opacity,
                            display: useTransform(shouldRender, (render) => (render ? "flex" : "none")),
                        }}
                    >
                        <p>{message}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TimelineMessages;
