import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { Button, Form, Loader} from 'semantic-ui-react';
import { useRouter } from 'next/router'
import { server } from '@components/shared/Server';

const NewNote = () => {

    const [form, setForm] = useState({ title: '', description : ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const createNote = async () => {
        try
        {
            const rest = await fetch(`${server}/api/notes/`,{
                method: 'POST',
                headers : {
                    "Accept" : "application/json",
                    "Content-Type": "application/json",
                },
                body : JSON.stringify(form)
            });

            await router.push('/scrapbook');

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (isSubmitting) {

            // checking if the errors state its equal to 0, meaning no errors
            if (Object.keys(errors).length === 0) {
                createNote();
            } else {
                setIsSubmitting(false);
            }

        }
    }, [errors]);

    const validate = () => {
        let error = {}

        if (!form.title){
            error.title = 'Title is required';
        }
        if (!form.description){
            error.description = 'Description is required';
        }

        return error;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let errors = validate();
        setErrors(errors);
        setIsSubmitting(true);
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    return (
        <div className="form-container">
            <h1>Create note</h1>
            <div>
            {
                isSubmitting ? <Loader active inline="centered" /> :
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            error={errors.title ? { content: 'please enter the title', pointing : 'below'} : null}
                            label="Title"
                            placeholder="Title"
                            name="title"
                            onChange={handleChange}
                        />
                        <Form.TextArea
                            error={errors.description ? { content: 'please enter a description', pointing : 'below'} : null}
                            label="Description"
                            placeholder="Description"
                            name="description"
                            onChange={handleChange}
                        />
                        <Button type="submit">Create</Button>
                      </Form>
            }
            </div>
        </div>
    );
}

export default NewNote;