import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import { useScrollReveal, useCardReveal } from "@hooks/animations";
import type { CachedProject } from "@lib/services/github";

/* ------------------------------------------------------------------ */
/*  Language → icon mapping                                            */
/* ------------------------------------------------------------------ */

const LANGUAGE_ICONS: Record<string, string> = {
    TypeScript: "now-ui-icons design-2_html5",
    JavaScript: "now-ui-icons education_atom",
    Python: "now-ui-icons education_atom",
    Java: "now-ui-icons ui-2_settings-90",
    "C#": "now-ui-icons education_atom",
    HTML: "now-ui-icons design-2_html5",
    CSS: "now-ui-icons design_palette",
    Shell: "now-ui-icons shopping_credit-card",
    ShaderLab: "now-ui-icons design_palette",
    HLSL: "now-ui-icons design_app",
    Dockerfile: "now-ui-icons tech_laptop",
    PowerShell: "now-ui-icons shopping_credit-card",
    "Wolfram Language": "now-ui-icons education_atom",
    PHP: "now-ui-icons education_atom",
};

/** Map language names to warm accent hues for the language bar */
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    "C#": "#178600",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    ShaderLab: "#222c37",
    HLSL: "#aace60",
    Dockerfile: "#384d54",
    PowerShell: "#012456",
    "Wolfram Language": "#dd1100",
    PHP: "#4F5D95",
};

/**
 * Map project URLs → screenshot filenames in public/img/projects/.
 * Projects with a matching file get the screenshot as the card header.
 * Projects without one keep the default gradient + GitHub icon.
 */
const PROJECT_IMAGES: Record<string, string> = {
    "https://github.com/strubloid/.bash_aliases": "bash-aliases.png",
    "https://github.com/strubloid/cardgame": "cardgame.png",
    "https://github.com/strubloid/py-music": "py-music.png",
    "https://github.com/strubloid/spermwhale": "spermwhale.png",
    "https://github.com/strubloid/ReactAndJava": "reactandjava.png",
};

function getProjectImage(url: string): string | null {
    const file = PROJECT_IMAGES[url];
    return file ? `/img/projects/${file}` : null;
}

interface GithubProps {
    projects: CachedProject[];
}

const Github: React.FC<GithubProps> = ({ projects }) => {
    const revealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
    const cardsRef = useCardReveal<HTMLDivElement>({ staggerDelay: 180 });

    return (
        <div className="section section-github" ref={revealRef}>
            <Container>
                {/* Section header */}
                <Row className="mb-5">
                    <Col lg="7" md="12">
                        <div className="section-description">
                            <h6 className="category" data-reveal="fade-up">
                                Some of my projects
                            </h6>
                            <h2 className="title" data-reveal="fade-up" data-reveal-delay="120">
                                Github
                            </h2>
                            <h5 className="description" data-reveal="fade-up" data-reveal-delay="240">
                                Here you will find some good content from my Github account, as I had to export some projects from my own personal git repository to become public
                                on the github.
                            </h5>
                            <div className="github-buttons" data-reveal="fade-up" data-reveal-delay="360">
                                <Button className="btn-round" color="info" href="https://github.com/strubloid" target="_blank">
                                    Check me out on Github!
                                </Button>
                            </div>
                            <div className="clearfix" />
                        </div>
                    </Col>
                    <Col lg="5" md="12" className="github-column">
                        <div className="github-background-container" data-reveal="fade-left" data-reveal-delay="300">
                            <i className="fab fa-github" />
                        </div>
                    </Col>
                </Row>

                {/* Project cards — full width, 3 columns */}
                <div className="github-cards-grid" ref={cardsRef}>
                    {projects.map((project) => (
                        <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" data-card-reveal>
                            <Card className="github-project-card">
                                {/* Project screenshot header — falls back to gradient when no image */}
                                <div
                                    className={`card-image-header${getProjectImage(project.url) ? " has-image" : ""}`}
                                    style={getProjectImage(project.url) ? { backgroundImage: `url(${getProjectImage(project.url)})` } : undefined}
                                >
                                    <i className="fab fa-github" />
                                    {project.stars > 0 && (
                                        <span className="star-badge">
                                            <i className="fas fa-star" /> {project.stars}
                                        </span>
                                    )}
                                </div>

                                <CardBody>
                                    <CardTitle tag="h3">{project.name}</CardTitle>
                                    <p className="card-description">{project.description}</p>

                                    {/* Language bar visualization */}
                                    {project.languages.length > 0 && (
                                        <div className="language-section">
                                            <div className="language-bar">
                                                {project.languages.map((lang) => (
                                                    <div
                                                        key={lang.name}
                                                        className="language-bar-segment"
                                                        style={{
                                                            width: `${lang.percentage}%`,
                                                            backgroundColor: LANGUAGE_COLORS[lang.name] ?? "var(--color-clay)",
                                                        }}
                                                        title={`${lang.name} ${lang.percentage}%`}
                                                    />
                                                ))}
                                            </div>
                                            <ul className="language-list">
                                                {project.languages.map((lang) => (
                                                    <li key={lang.name}>
                                                        <span className="lang-dot" style={{ backgroundColor: LANGUAGE_COLORS[lang.name] ?? "var(--color-clay)" }} />
                                                        <i className={LANGUAGE_ICONS[lang.name] ?? "now-ui-icons design_app"} />
                                                        {lang.name} <span className="lang-pct">{lang.percentage}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </a>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Github;
