import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useScrollReveal } from "../../hooks/useScrollReveal";
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

const AboutMe: React.FC<AboutMeProps> = ({ skills }) => {
    const revealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerDelay: 150, reversible: true });

    // Split skills into two columns
    const leftSkills = skills.filter((_, i) => i % 2 === 0);
    const rightSkills = skills.filter((_, i) => i % 2 === 1);

    const handleCardClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const renderCard = (skill: Skill, colIndex: number, direction: "fade-right" | "fade-left") => (
        <div
            key={skill.id}
            className={`skill-card${skill.link ? " skill-card--linked" : ""}`}
            data-reveal={direction}
            data-reveal-delay={String(200 + colIndex * 180)}
            onClick={skill.link ? () => handleCardClick(skill.link!.url) : undefined}
            role={skill.link ? "link" : undefined}
            tabIndex={skill.link ? 0 : undefined}
            onKeyDown={skill.link ? (e) => { if (e.key === "Enter") handleCardClick(skill.link!.url); } : undefined}
        >
            <div className="skill-card__icon" style={{ color: ACCENT_MAP[skill.accent] ?? "var(--color-accent)" }}>
                <i className={skill.icon} />
            </div>
            <div className="skill-card__body">
                <h5 className="skill-card__title">{skill.title}</h5>
                <p className="skill-card__desc">
                    {skill.description}
                    {skill.link && (
                        <span className="skill-card__link-label">
                            {" "}{skill.link.text} <i className="now-ui-icons ui-1_send" />
                        </span>
                    )}
                </p>
            </div>
        </div>
    );

    return (
        <div className="section section-image homepage-about-me" ref={revealRef}>
            <Container fluid>
                <Row>
                    <Col md="12">
                        <div className="about-me-header" data-reveal="fade-up">
                            <span className="about-me-header__accent" />
                            <h6 className="about-me-header__category">Skills &amp; Experience</h6>
                            <h2 className="about-me-header__title">Who Am I</h2>
                            <span className="about-me-header__accent" />
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
