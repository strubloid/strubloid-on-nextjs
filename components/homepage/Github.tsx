import React from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface GithubProject {
    name: string;
    url: string;
    items: { icon: string; label: React.ReactNode }[];
    description: string;
}

const PROJECTS: GithubProject[] = [
    {
        name: "My Resume",
        url: "https://github.com/strubloid/resume",
        description: "This is a collection of explanations that I'd to do for co-workers",
        items: [
            { icon: "now-ui-icons design_app", label: "TSQL" },
            { icon: "now-ui-icons shopping_credit-card", label: "Shell" },
            { icon: "now-ui-icons ui-2_settings-90", label: "PHP" },
            { icon: "now-ui-icons design-2_html5", label: "HTML" },
            { icon: "now-ui-icons education_atom", label: "Javascript" },
        ],
    },
    {
        name: ".bash_aliases",
        url: "https://github.com/strubloid/.bash_aliases",
        description: "This is mainly a new way to create your ~/.bash_aliases",
        items: [
            {
                icon: "now-ui-icons design_bullet-list-67",
                label: ".bash_aliases in classes",
            },
            {
                icon: "now-ui-icons arrows-1_refresh-69",
                label: (
                    <>
                        Update environment with: <br />
                        tu [terminal update]
                    </>
                ),
            },
            { icon: "now-ui-icons tech_laptop", label: "Linux & Mac" },
            { icon: "now-ui-icons shopping_credit-card", label: "Shellscript" },
        ],
    },
];

const Github: React.FC = () => {
    const revealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

    return (
        <div className="section section-github" ref={revealRef}>
            <Container>
                <Row>
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
                        <Row>
                            {PROJECTS.map((project, idx) => (
                                <Col key={project.name} className="pt-5" md="6" sm="6">
                                    <a href={project.url} target="_blank" rel="noopener noreferrer" data-reveal="fade-up" data-reveal-delay={String(480 + idx * 150)}>
                                        <Card className="card-pricing card-background modern-card">
                                            <CardBody>
                                                <CardTitle tag="h3">{project.name}</CardTitle>
                                                <ul>
                                                    <li>{project.description}</li>
                                                    {project.items.map((item, itemIdx) => (
                                                        <li key={itemIdx}>
                                                            <i className={item.icon} /> {item.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </a>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col lg="5" md="12" className="github-column">
                        <div className="github-background-container" data-reveal="fade-left" data-reveal-delay="300">
                            <i className="fab fa-github" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Github;
