import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Confirm, Button, Loader } from 'semantic-ui-react';

const Note = () => {
    const [confirm, setConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {

        if (isDeleting) {
            deleteNote();
        }

    }, [isDeleting])
    const open = () => setConfirm(true);
    const close = () => setConfirm(false);

    const handleDelete =  async () => {
        setIsDeleting(true);
        close();
    }

    const deleteNote = async () => {
        const noteId = router.query.id;
        try {
            const deleted = await fetch(`http://localhost:3333/api/notes/${noteId}`, {
                method : "Delete"
            })

            router.push('/notes')
        } catch (e){
            console.log(e);
        }
    }

    return (
        <div className="note-container">
            { isDeleting ? <Loader /> :
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
    )
}

Note.getInitialProps = async ({ query: { id }}) => {
    const res = await fetch(`http://localhost:3333/api/notes${id}`)
    const { data } = await res.json();
    return { note: data };
}

export default Note;