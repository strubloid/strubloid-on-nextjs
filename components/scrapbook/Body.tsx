import React from "react";
import Link from "next/link";
import { Button, Card } from "semantic-ui-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import type { INote } from "../../types";

interface BodyProps {
    notes: INote[];
}

const Body: React.FC<BodyProps> = ({ notes }) => {
    const sectionRef = useScrollReveal();

    return (
        <div className="notes-container scrapbook-body" ref={sectionRef}>
            <div className="scrapbook-section-header" data-reveal="fade-up">
                <span className="scrapbook-category">My Collection</span>
                <h1 className="scrapbook-title">Notes</h1>
            </div>
            <div className="grid wrapper scrapbook-grid">
                {notes.map((note, index) => (
                    <div key={note._id} data-reveal="fade-up" data-reveal-delay={String(index)}>
                        <Card className="scrapbook-card">
                            <Card.Content>
                                <Card.Header>
                                    <Link href={`/scrapbook/${note._id}`}>{note.title}</Link>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content extra className="scrapbook-card-actions">
                                <Link href={`/scrapbook/${note._id}`}>
                                    <Button className="scrapbook-btn scrapbook-btn-view">View</Button>
                                </Link>
                                <Link href={`/scrapbook/${note._id}/edit`}>
                                    <Button className="scrapbook-btn scrapbook-btn-edit">Edit</Button>
                                </Link>
                            </Card.Content>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Body;
