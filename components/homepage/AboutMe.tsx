import React, { useCallback, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useMatrixReveal } from "../../hooks/useMatrixReveal";
import type { Skill } from "../../lib/strubloid";

/** Map accent shorthand from JSON to CSS variable */
const ACCENT_MAP: Record<string, string> = {
    accent: "var(--color-accent)",
    info: "var(--color-info)",
    "brazil-green": "var(--color-brazil-green)",
    "brazil-gold": "var(--color-brazil-gold)",
};

interface AboutMeProps {
    skills: Skill[];
}

/**
 * 3D tilt effect – tracks mouse position over each card and applies a subtle
 * perspective rotation + dynamic lighting via CSS custom properties.
 */
function use3DTilt() {
    const cardsRef = useRef<HTMLElement[]>([]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // ±8 deg rotation
        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 6;

        // Light position for the glare
        const lightX = (x / rect.width) * 100;
        const lightY = (y / rect.height) * 100;

        card.style.setProperty("--rotateX", `${rotateX}deg`);
        card.style.setProperty("--rotateY", `${rotateY}deg`);
        card.style.setProperty("--lightX", `${lightX}%`);
        card.style.setProperty("--lightY", `${lightY}%`);
        card.classList.add("skill-card--tilting");
    }, []);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        card.style.removeProperty("--rotateX");
        card.style.removeProperty("--rotateY");
        card.style.removeProperty("--lightX");
        card.style.removeProperty("--lightY");
        card.classList.remove("skill-card--tilting");
    }, []);

    const registerCard = useCallback(
        (el: HTMLElement | null) => {
            if (!el) return;
            if (cardsRef.current.includes(el)) return;
            cardsRef.current.push(el);
            el.addEventListener("mousemove", handleMouseMove);
            el.addEventListener("mouseleave", handleMouseLeave);
        },
        [handleMouseMove, handleMouseLeave],
    );

    useEffect(() => {
        return () => {
            cardsRef.current.forEach((el) => {
                el.removeEventListener("mousemove", handleMouseMove);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
            cardsRef.current = [];
        };
    }, [handleMouseMove, handleMouseLeave]);

    return registerCard;
}

const AboutMe: React.FC<AboutMeProps> = ({ skills }) => {
    // Matrix reveal for skill cards (handles intersection + canvas)
    const matrixRef = useMatrixReveal<HTMLDivElement>({
        threshold: 0.12,
        staggerDelay: 100,
        matrixDuration: 800,
    });

    // Separate scroll reveal just for the header
    const headerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2, reversible: true });

    const registerTilt = use3DTilt();

    // Split skills into two columns
    const leftSkills = skills.filter((_, i) => i % 2 === 0);
    const rightSkills = skills.filter((_, i) => i % 2 === 1);

    const handleCardClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const renderCard = (skill: Skill, colIndex: number, direction: "fade-right" | "fade-left") => (
        <div
            key={skill.id}
            ref={registerTilt}
            className={`skill-card${skill.link ? " skill-card--linked" : ""}`}
            data-reveal-delay={String(200 + colIndex * 200)}
            data-direction={direction}
            onClick={skill.link ? () => handleCardClick(skill.link!.url) : undefined}
            role={skill.link ? "link" : undefined}
            tabIndex={skill.link ? 0 : undefined}
            onKeyDown={
                skill.link
                    ? (e) => {
                          if (e.key === "Enter") handleCardClick(skill.link!.url);
                      }
                    : undefined
            }
        >
            {/* Holographic glare overlay */}
            <div className="skill-card__glare" />
            {/* Edge glow */}
            <div className="skill-card__edge-glow" />

            <div className="skill-card__content">
                <div className="skill-card__icon" style={{ color: ACCENT_MAP[skill.accent] ?? "var(--color-accent)" }}>
                    <i className={skill.icon} />
                </div>
                <div className="skill-card__body">
                    <h5 className="skill-card__title">{skill.title}</h5>
                    <p className="skill-card__desc">
                        {skill.description}
                        {skill.link && (
                            <span className="skill-card__link-label">
                                {" "}
                                {skill.link.text} <i className="now-ui-icons ui-1_send" />
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section section-image homepage-about-me" ref={matrixRef}>
            <Container fluid>
                <Row>
                    <Col md="12">
                        <div className="about-me-header" ref={headerRef}>
                            <div className="about-me-header__inner" data-reveal="fade-up">
                                <span className="about-me-header__accent" />
                                <h6 className="about-me-header__category">Skills &amp; Experience</h6>
                                <h2 className="about-me-header__title">Who Am I</h2>
                                <span className="about-me-header__accent" />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="skills-grid">
                    <Col md="6" className="skills-column">
                        {leftSkills.map((skill, idx) => renderCard(skill, idx, "fade-right"))}
                    </Col>
                    <Col md="6" className="skills-column">
                        {rightSkills.map((skill, idx) => renderCard(skill, idx, "fade-left"))}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutMe;
