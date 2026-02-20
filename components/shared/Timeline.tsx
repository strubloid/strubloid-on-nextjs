import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import styles from "./Timeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Reverse items to show chronologically from oldest to newest (left to right)
  const sortedItems = [...items].reverse();

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const container = containerRef.current;
    const track = trackRef.current;

    // Wait for DOM to stabilize and measure real content
    const timer = setTimeout(() => {
      // Kill existing triggers first
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Get actual scroll distance needed
      const trackWidth = track.scrollWidth;
      const containerWidth = container.offsetWidth;
      const scrollDistance = trackWidth - containerWidth;

      if (scrollDistance <= 0) return;

      // Reset track position to start at x: 0
      gsap.set(track, { x: 0 });

      // Create the main animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${scrollDistance * 5}`,
          markers: false,
        },
      });

      // Animate track to move RIGHT as page scrolls DOWN
      tl.to(track, {
        x: scrollDistance,
        ease: "power1.inOut",
      });

      // Refresh to recalculate all triggers
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [sortedItems]);

  return (
    <div className={styles["timeline-section"]}>
      <div className={styles["timeline-header"]}>
        <h2>{title}</h2>
        <p className={styles["timeline-subtitle"]}>Scroll down to explore my journey →</p>
      </div>

      <div className={styles["timeline-container"]} ref={containerRef}>
        <div className={styles["timeline-track"]} ref={trackRef}>
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
                style={{
                  "--item-delay": `${index * 0.1}s`,
                } as React.CSSProperties}
              >
                {/* Dot/Ball */}
                <div
                  className={`${styles["timeline-dot"]} ${
                    hoveredId === item.id ? styles["active"] : ""
                  }`}
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
                            <span className={`${styles["skill-tag"]} ${styles["more"]}`}>+{item.skills.length - 5}</span>
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
          </div>

          {/* End marker */}
          <div className={styles["timeline-end"]}>
            <div className={styles["end-dot"]}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
