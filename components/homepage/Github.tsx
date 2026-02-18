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
        description: "A collection of explanations and documentation for co-workers",
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
        description: "A structured way to create your ~/.bash_aliases using classes",
        items: [
            { icon: "now-ui-icons design_bullet-list-67", label: ".bash_aliases in classes" },
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
    {
        name: "Cardgame",
        url: "https://github.com/strubloid/cardgame",
        description: "A card game built with Unity featuring fireball mechanics and card dealing systems",
        items: [
            { icon: "now-ui-icons education_atom", label: "C# 51.5%" },
            { icon: "now-ui-icons design_palette", label: "ShaderLab 31.5%" },
            { icon: "now-ui-icons media-1_button-play", label: "Unity Engine" },
            { icon: "now-ui-icons design_app", label: "HLSL Shaders" },
        ],
    },
    {
        name: "Python Music",
        url: "https://github.com/strubloid/py-music",
        description: "Full-stack music theory app with interactive piano, guitar fretboard, and chord progressions",
        items: [
            { icon: "now-ui-icons education_atom", label: "Python Flask" },
            { icon: "now-ui-icons design-2_html5", label: "React 18 + Vite" },
            { icon: "now-ui-icons media-1_button-play", label: "Piano & Guitar Fretboard" },
            { icon: "now-ui-icons ui-2_settings-90", label: "Music Theory Engine" },
        ],
    },
    {
        name: "Sperm Whale",
        url: "https://github.com/strubloid/spermwhale",
        description: "Real-time transcription and translation system using OpenAI Whisper with CUDA GPU support",
        items: [
            { icon: "now-ui-icons education_atom", label: "Python 97.6%" },
            { icon: "now-ui-icons ui-2_chat-round", label: "OpenAI Whisper" },
            { icon: "now-ui-icons arrows-1_refresh-69", label: "Multi-Engine Translation" },
            { icon: "now-ui-icons tech_laptop", label: "CUDA GPU Support" },
        ],
    },
    {
        name: "React & Java",
        url: "https://github.com/strubloid/ReactAndJava",
        description: "Book Manager application with a React TypeScript frontend and Java Spring backend",
        items: [
            { icon: "now-ui-icons design-2_html5", label: "TypeScript 52.8%" },
            { icon: "now-ui-icons ui-2_settings-90", label: "Java 33.3%" },
            { icon: "now-ui-icons design_app", label: "React Frontend" },
            { icon: "now-ui-icons shopping_credit-card", label: "Spring Backend" },
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
