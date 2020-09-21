import fetch from 'isomorphic-unfetch';
import NewNote from '@components/notes/NewNote';
import NotesHeader from '@components/notes/Header';

const NewNotePage = ({ notes }) => {
    return (
        <>
            <NotesHeader />
            <div className="container">
                <NewNote />
            </div>
        </>
    )
}

export default NewNotePage;
