import fetch from 'isomorphic-unfetch';
import Body from '@components/notes/Body';
import NotesHeader from '@components/notes/Header';
import { getBaseUrl } from '@components/shared/BaseUrl'

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

    const BASE_URL = getBaseUrl(req);
    const fetchData  = await fetch(`${BASE_URL}/api/notes/`);
    const { data } = await fetchData.json();

    return { notes: data };
}

export default Index;