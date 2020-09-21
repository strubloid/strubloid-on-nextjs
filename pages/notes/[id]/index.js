import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Confirm, Button, Loader } from 'semantic-ui-react';
import BaseUrl from '@components/shared/BaseUrl'
import BasicHeader from '@components/shared/BasicHeader'

const Note = ({ note }) => {
    const [confirm, setConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const deleteNote = async (req) => {
        const noteId = router.query.id;
        try {
            const BASE_URL = BaseUrl(req);
            const deleted = await fetch(`${BASE_URL}/api/notes/${noteId}`, {
                method: "Delete"
            });

            router.push("/notes");
        } catch (error) {
            console.log(error)
        }
    }

    useEffect((req) => {
        if (isDeleting) {
            deleteNote(req);
        }
    }, [isDeleting])

    const open = () => setConfirm(true);

    const close = () => setConfirm(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        close();
    }

    return (
        <>
            <BasicHeader />
        <div className="container note-container">
            {isDeleting
                ? <Loader active />
                :
                <>
                    <h1>{note.title}</h1>
                    <p>{note.description}</p>
                    <Button color='red' onClick={open}>Delete</Button>
                </>
            }
            <Confirm
                open={confirm}
                onCancel={close}
                onConfirm={handleDelete}
            />
        </div>
        </>
    )
}

Note.getInitialProps = async ({ req, query: { id }}) => {
    const BASE_URL = BaseUrl(req);
    const res = await fetch(`${BASE_URL}/api/notes/${id}`)
    const { data } = await res.json();
    return { note: data };
}

export default Note;