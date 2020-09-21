import fetch from 'isomorphic-unfetch';
import Body from '@components/notes/Body';
import NotesHeader from '@components/notes/Header';
import BaseUrl from '@components/shared/BaseUrl';

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

Index.getInitialProps = async ({req, res}) => {

    const BASE_URL = BaseUrl(req);

    // const res  = await fetch(`${origin}/api/notes/`);
    const fetchData  = await fetch(`${BASE_URL}/api/notes/`);
    const { data } = await fetchData.json();

    return { notes: data };
}

export default Index;