import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TimelineItem {
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

interface DetailPanelProps {
  item: TimelineItem;
  isVisible: boolean;
  styles: any;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ item, isVisible, styles }) => {
  const detailRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detailRef.current) return;

    // Kill any running animations
    gsap.killTweensOf([detailRef.current, headerRef.current, rightRef.current, bottomLeftRef.current, bottomRightRef.current]);

    if (isVisible) {
      // Create timeline for coordinated animations
      const tl = gsap.timeline();

      // Fade in container first with delay
      tl.to(detailRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);

      // Animate header (top-left) - year, company, title
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.1
        );
      }

      // Animate right panel (top-right) - description
      if (rightRef.current) {
        tl.fromTo(
          rightRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.2
        );
      }

      // Animate bottom left (skills)
      if (bottomLeftRef.current) {
        tl.fromTo(
          bottomLeftRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.3
        );
      }

      // Animate bottom right (highlights)
      if (bottomRightRef.current) {
        tl.fromTo(
          bottomRightRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.4
        );

        // Animate highlight list items
        const highlightsList = bottomRightRef.current.querySelector("ul");
        if (highlightsList) {
          const highlights = highlightsList.querySelectorAll("li");
          gsap.fromTo(
            highlights,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          );
        }
      }
    } else {
      // Fade out - make everything invisible
      if (detailRef.current) gsap.to(detailRef.current, { opacity: 0, duration: 0.3 });
      if (headerRef.current) gsap.to(headerRef.current, { opacity: 0, duration: 0.3 });
      if (rightRef.current) gsap.to(rightRef.current, { opacity: 0, duration: 0.3 });
      if (bottomLeftRef.current) gsap.to(bottomLeftRef.current, { opacity: 0, duration: 0.3 });
      if (bottomRightRef.current) gsap.to(bottomRightRef.current, { opacity: 0, duration: 0.3 });
    }

    return () => {
      gsap.killTweensOf([headerRef.current, rightRef.current, bottomLeftRef.current, bottomRightRef.current]);
    };
  }, [isVisible]);

  return (
    <div
      ref={detailRef}
      className={`${styles["timeline-detail"]} ${isVisible ? styles["show"] : ""}`}
    >
      <div className={styles["detail-inner"]}>
        {/* Top Left: Year + Company + Title */}
        <div ref={headerRef} className={styles["detail-header"]}>
          <div className={styles["detail-year"]}>{item.year}</div>
          {item.company && <p className={styles["detail-company"]}>{item.company}</p>}
          <h3 className={styles["detail-title"]}>{item.title}</h3>
        </div>

        {/* Top Right: Description + Position */}
        <div ref={rightRef} className={styles["detail-right"]}>
          {item.position && <p className={styles["detail-position"]}>{item.position}</p>}
          <p className={styles["detail-description"]}>{item.description}</p>
        </div>

        {/* Bottom Left: Skills */}
        {item.skills && item.skills.length > 0 && (
          <div ref={bottomLeftRef} className={styles["detail-bottom-left"]}>
            <div className={styles["detail-skills"]}>
              <span className={styles["skills-label"]}>Skills</span>
              <div className={styles["skills-list"]}>
                {item.skills.slice(0, 6).map((skill, idx) => (
                  <span key={idx} className={styles["skill-tag"]}>
                    {skill}
                  </span>
                ))}
                {item.skills.length > 6 && (
                  <span className={`${styles["skill-tag"]} ${styles["more"]}`}>
                    +{item.skills.length - 6}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Right: Highlights */}
        {item.highlights && item.highlights.length > 0 && (
          <div ref={bottomRightRef} className={styles["detail-bottom-right"]}>
            <div className={styles["detail-highlights"]}>
              <span className={styles["highlights-label"]}>Highlights</span>
              <ul>
                {item.highlights.slice(0, 3).map((highlight, idx) => (
                  <li key={idx}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
