import Body from '../../components/scrapbook/Body';
import NotesHeader from '../../components/scrapbook/Header';
import { server } from '../../components/shared/Server';

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

export async function getServerSideProps() {
    const fetchData = await fetch(`${server}/api/notes/`);
    const { data } = await fetchData.json();
    const notes = data !== undefined && data.length > 0 ? data : [];

    return { props: { notes } };
}

export default Index;