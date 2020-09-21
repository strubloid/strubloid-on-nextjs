import Link from 'next/link';
import { Button, Card} from 'semantic-ui-react';

const Body = ({ notes }) => {
    return (
        <div className="notes-container">
            <h1>Notes</h1>
            <div className="grid wrapper">
                {notes.map( note => {
                    return (
                        <div key={note._id}>
                            <Card>
                                <Card.Content>
                                    <Card.Header>
                                        <Link href={`/notes/${note._id}`}>
                                            <a>{note.title}</a>
                                        </Link>
                                    </Card.Header>
                                </Card.Content>
                                <Card.Content extra>
                                    <Link href={`/notes/${note._id}`}>
                                        <Button primary>View</Button>
                                    </Link>
                                </Card.Content>
                                <Card.Content extra>
                                    <Link href={`/notes/${note._id}/edit`}>
                                        <Button primary>Edit</Button>
                                    </Link>
                                </Card.Content>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Body;