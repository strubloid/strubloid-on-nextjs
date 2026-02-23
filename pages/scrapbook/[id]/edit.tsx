import React, { useState, useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Button, Form, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { server } from "@utils/constants/server";
import type { INote, INoteForm, IFormErrors } from "@types";

interface EditNoteProps {
    note: INote;
}

const EditNote: NextPage<EditNoteProps> = ({ note }) => {
    const [form, setForm] = useState<INoteForm>({
        title: note.title,
        description: note.description,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<IFormErrors>({});
    const router = useRouter();

    /** PUT update to the API */
    const updateNote = async (): Promise<void> => {
        try {
            await fetch(`${server}/api/notes/${router.query.id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            await router.push("/scrapbook");
        } catch {
            console.error("Failed to update note");
        }
    };

    /** Trigger update once validation passes */
    useEffect(() => {
        if (!isSubmitting) return;
        if (Object.keys(errors).length === 0) {
            updateNote();
        } else {
            setIsSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    const validate = (): IFormErrors => {
        const err: IFormErrors = {};
        if (!form.title) err.title = "Title is required";
        if (!form.description) err.description = "Description is required";
        return err;
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setErrors(validate());
        setIsSubmitting(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="form-container">
            <h1>Update Note</h1>
            <div>
                {isSubmitting ? (
                    <Loader active inline="centered" />
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            error={errors.title ? { content: "Please enter a title", pointing: "below" } : null}
                            label="Title"
                            placeholder="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                        />
                        <Form.TextArea
                            label="Description"
                            placeholder="Description"
                            name="description"
                            error={
                                errors.description
                                    ? {
                                          content: "Please enter a description",
                                          pointing: "below",
                                      }
                                    : null
                            }
                            value={form.description}
                            onChange={handleChange}
                        />
                        <Button type="submit">Update</Button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<EditNoteProps> = async ({ query }) => {
    const id = query.id as string;
    const res = await fetch(`${server}/api/notes/${id}`);
    const { data } = await res.json();
    return { props: { note: data } };
};

export default EditNote;
