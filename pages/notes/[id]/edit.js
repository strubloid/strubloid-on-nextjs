import Link from 'next/link';
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { Button, Form, Loader } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import BaseUrl from '@components/shared/BaseUrl'

const EditNote = ({ note }) => {
    const [form, setForm] = useState({ title: note.title, description: note.description });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect((req) => {
        if (isSubmitting) {
            if (Object.keys(errors).length === 0) {
                updateNote(req);
            }
            else {
                setIsSubmitting(false);
            }
        }
    }, [errors])

    const updateNote = async (req) => {
        try {
            const BASE_URL = BaseUrl(req);
            const res = await fetch(`${BASE_URL}/api/notes/${router.query.id}`, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            router.push("/notes");
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let errs = validate();
        setErrors(errs);
        setIsSubmitting(true);
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validate = () => {
        let err = {};

        if (!form.title) {
            err.title = 'Title is required';
        }
        if (!form.description) {
            err.description = 'Description is required';
        }

        return err;
    }

    return (
        <div className="form-container">
            <h1>Update Note</h1>
            <div>
                {
                    isSubmitting
                        ? <Loader active inline='centered' />
                        : <Form onSubmit={handleSubmit}>
                            <Form.Input
                                error={errors.title ? { content: 'Please enter a title', pointing: 'below' } : null}
                                label='Title'
                                placeholder='Title'
                                name='title'
                                value={form.title}
                                onChange={handleChange}
                            />
                            <Form.TextArea
                                label='Descriprtion'
                                placeholder='Description'
                                name='description'
                                error={errors.description ? { content: 'Please enter a description', pointing: 'below' } : null}
                                value={form.description}
                                onChange={handleChange}
                            />
                            <Button type='submit'>Update</Button>
                        </Form>
                }
            </div>
        </div>
    )
}

EditNote.getInitialProps = async ({ req, query: { id } }) => {

    const BASE_URL = BaseUrl(req);
    const res = await fetch(`${BASE_URL}/api/notes/${id}`);
    const { data } = await res.json();

    return { note: data }
}

export default EditNote;