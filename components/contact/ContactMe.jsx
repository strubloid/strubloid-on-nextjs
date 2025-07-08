import React, { useEffect, useState } from 'react';
import { FormGroup, InputGroup, InputGroupText,
    Container, Row, Col } from "reactstrap";
import { Button, Input, TextArea, Form, Loader, Message } from 'semantic-ui-react';
import ReCAPTCHA from "react-google-recaptcha";
import { MapWrapper } from "./MapWrapper";
import { server } from '../shared/Server';
import fetch from 'isomorphic-unfetch';

const ContactMe = (props) => {

    const [nameFocus, setNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [numberFocus, setNumberFocus] = React.useState(false);
    const [messageFocus, setMessageFocus] = React.useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: {error: false, msg: null}
    });

    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        captcha: false,
    });

    /**
     * Response handler, this will set between success request (200)
     *  or any other else as a failure.
     * @param status status from the fetch call
     * @param msg message response from the fetch call
     */
    const handleResponse = (status, msg) => {

        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: {error: false, msg: msg}
            });
            setInputs({
                name: '',
                email: '',
                subject: '',
                message: '',
                captcha: false
            });
        } else {
            setStatus({
                info: {error: true, msg: msg}
            });
            setIsSubmitting(false);
        }
    };

    /**
     * Update of input value trigger.
     * @param e
     */
    const handleOnChange = e => {
        e.persist()
        setInputs(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
        setStatus({
            submitted: false,
            submitting: false,
            info: {error: false, msg: null}
        })
    };

    /**
     * Validation method, for all inputs.
     * @returns {{}}
     */
    const validate = () => {
        let error = {}

        if (!inputs.name){
            error.name = 'Name is required';
        }

        if (!inputs.email){
            error.email = 'Email is required';
        }

        if (!inputs.subject){
            error.subject = 'Subject is required';
        }

        if (!inputs.message){
            error.message = 'Message is required';
        }

        return error;
    }

    /**
     * This is the trigger to send the message,
     * wont be possible if has any error set.
     */
    useEffect(() => {
        if (isSubmitting) {

            // checking if the errors state its equal to 0, meaning no errors
            if (Object.keys(errors).length === 0) {
                sendMail();
            } else {
                setIsSubmitting(false);
            }

        }
    }, [errors]);

    /**
     * Set of the captcha value, so its possible to check
     * if was set the recaptcha response
     * @param value ReCaptcha response
     */
    const onChangeRecaptcha = value => {
        setInputs(prev => ({
            ...prev,
            captcha: value
        }))
    };

    /**
     * Method that will send the mail
     * @returns {Promise<void>}
     */
    const sendMail = async () => {
        try
        {
            setStatus(prevStatus => ({...prevStatus, submitting: true}))
            const res = await fetch(`${server}/api/contact/send/`, {
                method: 'POST',
                headers : {
                    "Accept" : "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs)
            })
            const text = await res.text()
            handleResponse(res.status, text)

        } catch (e) {
            console.log("Error");
        }
    }

    /**
     * Submit handle that only check if exists any error
     * if erros are empty the useEffect function
     * will trigger as errors are set and IsSubmiting is set to true.
     *
     * @param e
     * @returns {Promise<void>}
     */
    const handleOnSubmit = async e => {
        e.preventDefault();
        let errors = validate();
        setErrors(errors);
        setIsSubmitting(true);
    };

    /**
     * Layout changes
     */
    React.useEffect(() => {
        document.body.classList.add("contact-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        return function cleanup () {
            document.body.classList.remove("contact-page");
            document.body.classList.remove("sidebar-collapse");
        };
    }, []);

    return (
        <>
            <div className="main">
                <div className="contact-content">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="5">
                                <h2 className="title">Let's have a chat!</h2>
                                <p className="description">
                                    If you want to have a chat
                                    about <b>Coffee</b>, <b>PHP</b>, <b>React</b>, <b>Bash(Shellscript)</b> or any <b>new
                                    Tecnology</b>,
                                    please send me a message, I will promisse that I will get back to you! <br /><br />

                                    Do you want to work with me? Cool! I just ask to add to the
                                    header <b>[job-offer]</b>,
                                    so my robot can put you as priority in the queue!<br />
                                </p>
                                {
                                    isSubmitting ?
                                        !status.submitted
                                            ? <Loader active inline="centered" />
                                            : <Loader inactive inline="centered" />
                                        :
                                        <Form id="contact-me" onSubmit={handleOnSubmit}>
                                            <FormGroup>
                                                <label>Your name</label>
                                                <InputGroup className={nameFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons users_circle-08"></i>
                                                    </InputGroupText>
                                                    <Form.Field
                                                        id="name"
                                                        control={Input}
                                                        className="form-control"
                                                        aria-label="Your Name..."
                                                        autoComplete="name"
                                                        placeholder="Your Name..."
                                                        onFocus={() => setNameFocus(true)}
                                                        onBlur={() => setNameFocus(false)}
                                                        onChange={handleOnChange}
                                                        value={inputs.name}
                                                        error={errors.name ? { content: 'please enter a name', pointing : 'left'} : null}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <label>Email address</label>
                                                <InputGroup className={emailFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons ui-1_email-85"></i>
                                                    </InputGroupText>
                                                    <Form.Field
                                                        id="email"
                                                        control={Input}
                                                        className="form-control"
                                                        aria-label="Email Here..."
                                                        autoComplete="email"
                                                        placeholder="Email Here..."
                                                        onFocus={() => setEmailFocus(true)}
                                                        onBlur={() => setEmailFocus(false)}
                                                        onChange={handleOnChange}
                                                        value={inputs.email}
                                                        error={errors.email ? { content: 'please enter a email', pointing : 'left'} : null}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <label>Subject</label>
                                                <InputGroup className={numberFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons design-2_ruler-pencil"></i>
                                                    </InputGroupText>
                                                    <Form.Field
                                                        id="subject"
                                                        control={Input}
                                                        className="form-control"
                                                        aria-label="Subject Here..."
                                                        autoComplete="subject"
                                                        placeholder="What's the craic mate?"
                                                        onFocus={() => setNumberFocus(true)}
                                                        onBlur={() => setNumberFocus(false)}
                                                        onChange={handleOnChange}
                                                        value={inputs.subject}
                                                        error={errors.subject ? { content: 'please enter a subject', pointing : 'left'} : null}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup className={messageFocus ? "input-group-focus" : ""}>
                                                <label>Your message</label>
                                                <Form.Field
                                                    id="message"
                                                    className="form-control form-textarea"
                                                    rows="6"
                                                    autoComplete="message"
                                                    control={TextArea}
                                                    onChange={handleOnChange}
                                                    onFocus={() => setMessageFocus(true)}
                                                    onBlur={() => setMessageFocus(false)}
                                                    value={inputs.message}
                                                    error={errors.message ? { content: 'please enter a message', pointing : 'left'} : null}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_SITE_RECAPTCHA_KEY}
                                                           onChange={onChangeRecaptcha}
                                                />
                                            </FormGroup>
                                            <div className="submit text-center">
                                                <Button className="btn-raised btn-round btn btn-info"
                                                        defaultValue="Contact Us"
                                                        type="submit" disabled={status.submitting}>
                                                    {
                                                        !status.submitting
                                                            ? !status.submitted
                                                                ? 'Submit'
                                                                : 'Submitted'
                                                            : 'Submitting...'
                                                    }
                                                </Button>
                                            </div>
                                        </Form>
                                }
                                {status.info.error && (
                                    <Message
                                        error
                                        header='Error'
                                        content={status.info.msg}
                                    />
                                )}
                                {!status.info.error && status.info.msg && (
                                    <Message
                                        success
                                        header='Success'
                                        content={status.info.msg}
                                    />
                                )}
                            </Col>
                            <Col className="ml-auto mr-auto" md="5">
                                <div className="info info-horizontal mt-5">
                                    <div className="icon icon-info">
                                        <i className="now-ui-icons location_pin"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Find me in Dublin</h4>
                                        <p>
                                            Oak Apple green, <br></br>
                                            Dublin 6, <br></br>
                                            Dublin
                                        </p>
                                    </div>
                                </div>
                                <div className="info info-horizontal">
                                    <div className="icon icon-info">
                                        <i className="now-ui-icons tech_mobile"></i>
                                    </div>
                                    <div className="description">
                                        <h4 className="info-title">Give me a ring</h4>
                                        <p>
                                            Rafael Mendes <br />
                                            +353 83 8119 443 <br />
                                            Mon - Fri, 8:00-18:00
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <div className="big-map" id="contactUs2Map">
                <MapWrapper googleKey={props.googleKey} />
            </div>
        </>
    );
}

export default ContactMe;
