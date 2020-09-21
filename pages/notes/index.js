import fetch from 'isomorphic-unfetch';
import Body from '@components/notes/Body';
import NotesHeader from '@components/notes/Header';

const Index = ({ notes }) => {
    return (
        <>
            <NotesHeader />
            <div className="container">
                <Body notes={notes}/>
            </div>
        </>
    )
}

Index.getInitialProps = async () => {
    const res  = await fetch(`http://localhost:3333/api/notes/`);
    const { data } = await res.json();

    return { notes: data };
}

export default Index;