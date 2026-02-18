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
    const revealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerDelay: 150 });

    return (
        <div className="section features-7 section-image homepage-about-me" ref={revealRef}>
            <Container fluid>
                <Row>
                    <Col className="px-0" md="6">
                        <div className="about-me-header" data-reveal="fade-right">
                            <h6 className="category">Skills & Experience</h6>
                            <h2 className="title">Who Am I</h2>
                        </div>
                        <Col sm="12">
                            {skills.map((skill, idx) => (
                                <div key={skill.id} className="info info-horizontal skill-card" data-reveal="fade-up" data-reveal-delay={String(200 + idx * 150)}>
                                    <div className="icon" style={{ color: ACCENT_MAP[skill.accent] ?? "var(--color-accent)" }}>
                                        <i className={skill.icon} />
                                    </div>
                                    <div className="description">
                                        <h5 className="info-title">{skill.title}</h5>
                                        <p className="description">
                                            {skill.description}
                                            {skill.link && (
                                                <>
                                                    {" "}
                                                    <a href={skill.link.url} target="_blank" rel="noopener noreferrer">
                                                        {skill.link.text}
                                                    </a>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Col>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutMe;
