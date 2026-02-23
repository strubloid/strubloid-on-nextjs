import React, { useState, useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Confirm, Button, Loader } from "semantic-ui-react";
import { BasicHeader } from "@shared/components";
import { server } from "@components/shared/Server";
import type { INote } from "@types";

interface NotePageProps {
    note: INote;
}

const NotePage: NextPage<NotePageProps> = ({ note }) => {
    const [confirm, setConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    /** DELETE the note via API */
    const deleteNote = async (): Promise<void> => {
        const noteId = router.query.id as string;
        try {
            await fetch(`${server}/api/notes/${noteId}`, { method: "DELETE" });
            await router.push("/scrapbook");
        } catch {
            console.error("Failed to delete note");
        }
    };

    useEffect(() => {
        if (isDeleting) deleteNote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDeleting]);

    const handleDelete = (): void => {
        setIsDeleting(true);
        setConfirm(false);
    };

    return (
        <>
            <BasicHeader />
            <div className="container note-container">
                {isDeleting ? (
                    <Loader active />
                ) : (
                    <>
                        <h1>{note.title}</h1>
                        <p>{note.description}</p>
                        <Button color="red" onClick={() => setConfirm(true)}>
                            Delete
                        </Button>
                    </>
                )}
                <Confirm open={confirm} onCancel={() => setConfirm(false)} onConfirm={handleDelete} />
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<NotePageProps> = async ({ query }) => {
    const id = query.id as string;
    const res = await fetch(`${server}/api/notes/${id}`);
    const { data } = await res.json();
    return { props: { note: data } };
};

export default NotePage;
