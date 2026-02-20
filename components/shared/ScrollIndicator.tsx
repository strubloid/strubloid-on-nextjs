import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScrollIndicator.module.scss";

interface ScrollIndicatorProps {
  /** Whether to show the indicator (auto-hides on scroll) */
  visible?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ visible = true }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    const handleScroll = () => {
      // Hide when user scrolls down more than a small amount
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chevron animation variants
  const chevronVariants = {
    initial: { opacity: 0.3, y: 0 },
    animate: { opacity: [0.3, 1, 0.3], y: [0, 12, 0] },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles["scroll-indicator"]}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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
