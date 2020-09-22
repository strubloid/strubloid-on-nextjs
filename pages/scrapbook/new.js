import NewNote from '@components/scrapbook/NewNote';
import NotesHeader from '@components/scrapbook/Header';

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
