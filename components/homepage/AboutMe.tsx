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
    carousel?: boolean;
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

const AboutMe: React.FC<AboutMeProps> = ({ skills, carousel = true }) => {
    // State to track which skill is being hovered
    const [hoveredSkill, setHoveredSkill] = React.useState<string | null>(null);

    // Debug: Log which layout is being rendered
    React.useEffect(() => {
        console.log("📋 AboutMe Component Rendered | carousel:", carousel, "| skills count:", skills.length);
    }, [carousel, skills.length]);

    // Matrix reveal for skill cards (handles intersection + canvas)
    const matrixRef = useMatrixReveal<HTMLDivElement>({
        threshold: 0.12,
        staggerDelay: 100,
        matrixDuration: 800,
    });

    // Separate scroll reveal just for the header
    const headerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2, reversible: true });

    const registerTilt = use3DTilt();

    const handleCardClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const renderCard = (skill: Skill, isCarousel: boolean = true) => (
        <div
            key={skill.id}
            ref={registerTilt}
            className={`skill-card${isCarousel ? " skill-card--carousel" : ""}${skill.link ? " skill-card--linked" : ""}`}
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
            {isCarousel && (
                <>
                    {/* MTG Card top bar */}
                    <div className="skill-card__top-bar">
                        <span className="skill-card__category">Expertise</span>
                    </div>
                </>
            )}

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

            {isCarousel && (
                <>
                    {/* MTG Card bottom bar */}
                    <div className="skill-card__bottom-bar">
                        <span className="skill-card__power">+Skills</span>
                    </div>
                </>
            )}
        </div>
    );

    // Grid layout (for about-me page)
    if (!carousel) {
        console.log("🎨 Rendering GRID layout (carousel=false)");
        const leftSkills = skills.filter((_, i) => i % 2 === 0);
        const rightSkills = skills.filter((_, i) => i % 2 === 1);

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
                            {leftSkills.map((skill) => renderCard(skill, false))}
                        </Col>
                        <Col md="6" className="skills-column">
                            {rightSkills.map((skill) => renderCard(skill, false))}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // Two-column layout: Left (detail panel) + Right (skills list)
    console.log("✨ Rendering TWO-COLUMN layout (carousel=true) | hoveredSkill:", hoveredSkill);
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

                <Row className="skills-layout">
                    {/* Left Column: Detail Panel (appears on hover) */}
                    <Col md="5" className="skills-layout__left">
                        <div className="detail-panel">
                            {hoveredSkill && skills.find((s) => s.id === hoveredSkill) && (
                                <div className="detail-panel__content">
                                    {(() => {
                                        const skill = skills.find((s) => s.id === hoveredSkill);
                                        return (
                                            <>
                                                <div className="detail-panel__icon" style={{ color: ACCENT_MAP[skill!.accent] ?? "var(--color-accent)" }}>
                                                    <i className={skill!.icon} />
                                                </div>
                                                <div className="detail-panel__body">
                                                    <h3 className="detail-panel__title">{skill!.title}</h3>
                                                    <p className="detail-panel__description">{skill!.description}</p>
                                                    {skill!.link && (
                                                        <a href={skill!.link.url} target="_blank" rel="noopener noreferrer" className="detail-panel__link">
                                                            {skill!.link.text} <i className="now-ui-icons ui-1_send" />
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Right Column: Skills List */}
                    <Col md="7" className="skills-layout__right">
                        <div className="skills-list">
                            {skills.map((skill, idx) => (
                                <div
                                    key={skill.id}
                                    className={`skill-item ${hoveredSkill === skill.id ? "skill-item--hovered" : ""}`}
                                    style={{ "--skill-delay": `${idx * 50}ms` } as React.CSSProperties}
                                    onMouseEnter={() => {
                                        console.log("🎯 Hovering skill:", skill.id, skill.title);
                                        setHoveredSkill(skill.id);
                                    }}
                                    onMouseLeave={() => {
                                        console.log("👋 Left skill:", skill.id);
                                        setHoveredSkill(null);
                                    }}
                                >
                                    <div className="skill-item__icon" style={{ color: ACCENT_MAP[skill.accent] ?? "var(--color-accent)" }}>
                                        <i className={skill.icon} />
                                    </div>
                                    <div className="skill-item__content">
                                        <h5 className="skill-item__title">{skill.title}</h5>
                                        <p className="skill-item__desc">{skill.description}</p>
                                        {skill.link && (
                                            <a
                                                href={skill.link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="skill-item__link"
                                            >
                                                {skill.link.text} <i className="now-ui-icons ui-1_send" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutMe;
