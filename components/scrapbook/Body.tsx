import React from "react";
import Link from "next/link";
import { Button, Card } from "semantic-ui-react";
import type { INote } from "../../types";

interface BodyProps {
    notes: INote[];
}

const Body: React.FC<BodyProps> = ({ notes }) => (
    <div className="notes-container">
        <h1>Notes</h1>
        <div className="grid wrapper">
            {notes.map((note) => (
                <div key={note._id}>
                    <Card>
                        <Card.Content>
                            <Card.Header>
                                <Link href={`/scrapbook/${note._id}`}>{note.title}</Link>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <Link href={`/scrapbook/${note._id}`}>
                                <Button primary>View</Button>
                            </Link>
                        </Card.Content>
                        <Card.Content extra>
                            <Link href={`/scrapbook/${note._id}/edit`}>
                                <Button primary>Edit</Button>
                            </Link>
                        </Card.Content>
                    </Card>
                </div>
            ))}
        </div>
    </div>
);

export default Body;
