import fetch from 'isomorphic-unfetch';
import Body from '@components/scrapbook/Body';
import NotesHeader from '@components/scrapbook/Header';
import { server } from '@components/shared/Server';

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

    const fetchData  = await fetch(`${server}/api/notes/`);
    const { data } = await fetchData.json();
    const notes = data !== undefined || data.length > 0 ?  data : []

    return { notes: notes };
}

export default Index;