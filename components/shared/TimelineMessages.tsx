import React, { useEffect, useRef } from "react";
import { motion, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import styles from "./Timeline.module.scss";

interface TimelineMessagesProps {
    scrollYProgress: MotionValue<number>;
    onMessageChange?: () => void;
}

interface Message {
    text: string;
    speaker: string;
}

const TimelineMessages: React.FC<TimelineMessagesProps> = ({ scrollYProgress, onMessageChange }) => {
    const lastMessageIndexRef = useRef<number>(-1);
    const messages: Message[] = [
        { text: "IT is like a box for hackers, it will be a new mystery, that you will be having fun with it     ", speaker: "Strubloid" },
        { text: "Do you know I dont deploy on Friday?   ", speaker: "Strubloid" },

        { text: "I know how to read few languages and... speaking them too!    ", speaker: "Strubloid" },
        { text: "English, Portuguese, Nordestinês, French, Japanese, and Recently... Italian    ", speaker: "Strubloid" },

        { text: "I also know a few machine languages:    ", speaker: "Strubloid" },
        { text: "TypeScript , JavaScript, Nodejs , Python, PHP, Java, C, C++, C#, Bash    ", speaker: "Strubloid" },

        { text: "Even the love language I know! usualy you will hear from my guitar Ambrosia!    ", speaker: "Strubloid" },

        { text: "Yeah, this is the guy who will be working with you!  ", speaker: "Strubloid" },
        { text: "If you want to get more details, keep scrolling down  ", speaker: "Strubloid" },
    ];

    // Messages start after timeline-wrapper animation finishes (delayed to avoid overlap)
    const timelineFinishThreshold = 0.54; // Start messages after timeline finishes scrolling
    const messageDuration = 0.04; // How long each message stays fully visible
    const messageGap = 0.004; // Gap/spacing between messages
    const messageBuffer = 0.035; // Extra scroll space to see accumulated words before fade out
    const messageWidth = messageDuration + messageGap; // 0.04 per message = fits 9 messages in 0.35 range

    // Word-by-word rendering control
    const wordsPerBlock = 3; // Adjust this to control how many words appear together

    // Calculate current message index to only render visible message
    const currentMessageIndex = useTransform(scrollYProgress, (progress) => {
        if (progress < timelineFinishThreshold) return -1;
        const relativeProgress = progress - timelineFinishThreshold;
        const index = Math.floor(relativeProgress / messageWidth);
        return Math.min(index, messages.length - 1);
    });

    // Listen for message changes and trigger background update
    useMotionValueEvent(currentMessageIndex, "change", (latest) => {
        if (latest >= 0 && latest !== lastMessageIndexRef.current && onMessageChange) {
            lastMessageIndexRef.current = latest;
            onMessageChange();
        }
    });

    return (
        <div className={styles["timeline-messages"]}>
            {messages.map((message, messageIndex) => {
                const startScroll = timelineFinishThreshold + messageIndex * messageWidth;
                const endScroll = timelineFinishThreshold + (messageIndex + 1) * messageWidth;
                const messageDurationValue = endScroll - startScroll;

                // Extended opacity with buffer to keep words visible longer, then gradual fade out
                const opacity = useTransform(scrollYProgress, [startScroll, startScroll + 0.01, endScroll + messageBuffer - 0.02, endScroll + messageBuffer], [0, 1, 1, 0]);

                const shouldRender = useTransform(currentMessageIndex, (current) => current === messageIndex);

                // Split message into words
                const words = message.text.split(" ");
                const totalWords = words.length;
                const wordDuration = messageDurationValue / totalWords;

                // Calculate current word index based on scroll progress
                const currentWordIndex = useTransform(scrollYProgress, (progress) => {
                    if (progress < startScroll) return -1;
                    const relativeProgress = progress - startScroll;
                    const index = Math.floor(relativeProgress / wordDuration);
                    return Math.min(index, totalWords - 1);
                });

                return (
                    <motion.div
                        key={messageIndex}
                        className={`${styles["message-item"]} ${messageIndex === messages.length - 1 ? styles["final"] : ""}`}
                        style={{
                            opacity,
                            display: useTransform(shouldRender, (render) => (render ? "flex" : "none")),
                        }}
                    >
                        <div className={styles["message-content"]}>
                            <span className={styles["speaker-name"]}>{message.speaker}</span>
                            <div className={styles["words-container"]}>
                                {words.map((word, wordIdx) => {
                                    const wordStartScroll = startScroll + wordIdx * wordDuration;
                                    const wordEndScroll = startScroll + (wordIdx + 1) * wordDuration;
                                    const wordMidScroll = (wordStartScroll + wordEndScroll) / 2;

                                    // Word fades in and stays visible
                                    const wordOpacity = useTransform(scrollYProgress, [wordStartScroll, wordStartScroll + wordDuration * 0.2], [0, 1]);

                                    // Scale and color when "speaking" (current word)
                                    const wordScale = useTransform(scrollYProgress, (progress) => {
                                        const relativeProgress = progress - wordStartScroll;
                                        const blockProgress = relativeProgress / wordDuration;

                                        if (blockProgress < 0) return 1;
                                        if (blockProgress > 1) return 1;

                                        // Peak scale at middle of word duration
                                        if (blockProgress < 0.5) {
                                            return 1 + blockProgress * 0.5; // Grow to 1.25x
                                        } else {
                                            return 1.25 - (blockProgress - 0.5) * 0.5; // Shrink back
                                        }
                                    });

                                    const isSpeaking = useTransform(currentWordIndex, (idx) => idx === wordIdx);

                                    return (
                                        <motion.span
                                            key={wordIdx}
                                            className={styles["word"]}
                                            style={{
                                                opacity: wordOpacity,
                                                scale: wordScale,
                                            }}
                                        >
                                            <motion.span
                                                className={styles["word-inner"]}
                                                style={{
                                                    borderColor: useTransform(isSpeaking, (speaking) => (speaking ? "rgba(255, 107, 157, 0.8)" : "transparent")),
                                                    boxShadow: useTransform(isSpeaking, (speaking) => (speaking ? "0 0 20px rgba(255, 107, 157, 0.5)" : "none")),
                                                }}
                                            >
                                                {word}
                                            </motion.span>
                                        </motion.span>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TimelineMessages;
