import React, { useState, useEffect } from "react";
import { Button, Form, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { server, validateNoteForm } from "@utils";
import type { INoteForm } from "@types";

const NewNote: React.FC = () => {
    const [form, setForm] = useState<INoteForm>({ title: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<IFormErrors>({});
    const router = useRouter();

    /** POST the new note to the API */
    const createNote = async (): Promise<void> => {
        try {
            await fetch(`${server}/api/notes/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            await router.push("/scrapbook");
        } catch {
            console.error("Failed to create note");
        }
    };

    /** Trigger create once validation passes */
    useEffect(() => {
        if (!isSubmitting) return;
        if (Object.keys(errors).length === 0) {
            createNote();
        } else {
            setIsSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setErrors(validateNoteForm(form));
        setIsSubmitting(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="form-container">
            <h1>Create note</h1>
            <div>
                {isSubmitting ? (
                    <Loader active inline="centered" />
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            error={errors.title ? { content: "please enter the title", pointing: "below" } : null}
                            label="Title"
                            placeholder="Title"
                            name="title"
                            onChange={handleChange}
                        />
                        <Form.TextArea
                            error={
                                errors.description
                                    ? {
                                          content: "please enter a description",
                                          pointing: "below",
                                      }
                                    : null
                            }
                            label="Description"
                            placeholder="Description"
                            name="description"
                            onChange={handleChange}
                        />
                        <Button type="submit">Create</Button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default NewNote;
