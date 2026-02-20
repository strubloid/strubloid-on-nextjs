import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScrollIndicator.module.scss";

interface ScrollIndicatorProps {
  /** Whether to show the indicator (auto-hides on scroll) */
  visible?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ visible = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsVisible(true);
    setHasScrolled(false);

    const handleScroll = () => {
      // Hide when user scrolls down more than a small amount
      if (window.scrollY > 100 && !hasScrolled) {
        setIsVisible(false);
        setHasScrolled(true);
      } else if (window.scrollY <= 100) {
        setIsVisible(true);
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Chevron animation variants
  const chevronVariants = {
    initial: { opacity: 0.3, y: 0 },
    animate: { opacity: [0.3, 1, 0.3], y: [0, 12, 0] },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles["scroll-indicator"]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={styles["chevrons-container"]}>
            {/* Three stacked chevrons with staggered animation */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={styles["chevron"]}
                variants={chevronVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
