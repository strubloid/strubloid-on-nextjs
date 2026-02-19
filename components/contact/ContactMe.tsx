import React, { useEffect, useState } from "react";
import { FormGroup, InputGroup, InputGroupText, Container, Row, Col } from "reactstrap";
import { Button, Input, TextArea, Form, Loader, Message } from "semantic-ui-react";
import ReCAPTCHA from "react-google-recaptcha";
import { MapWrapper } from "./MapWrapper";
import { server } from "../shared/Server";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import type { IGoogleKeyProps, IContactInputs, IContactStatus, IFormErrors } from "../../types";

const INITIAL_STATUS: IContactStatus = {
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
};

const INITIAL_INPUTS: IContactInputs = {
    name: "",
    email: "",
    subject: "",
    message: "",
    captcha: false,
};

const ContactMe: React.FC<IGoogleKeyProps> = ({ googleKey }) => {
    const [nameFocus, setNameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [subjectFocus, setSubjectFocus] = useState(false);
    const [messageFocus, setMessageFocus] = useState(false);

    const [errors, setErrors] = useState<IFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<IContactStatus>(INITIAL_STATUS);
    const [inputs, setInputs] = useState<IContactInputs>(INITIAL_INPUTS);

    const sectionRef = useScrollReveal();

    /** Handle successful or failed API response */
    const handleResponse = (statusCode: number, msg: string): void => {
        if (statusCode === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg },
            });
            setInputs(INITIAL_INPUTS);
        } else {
            setStatus({ ...INITIAL_STATUS, info: { error: true, msg } });
            setIsSubmitting(false);
        }
    };

    /** Update an input field value */
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        setStatus(INITIAL_STATUS);
    };

    /** Validate all required fields */
    const validate = (): IFormErrors => {
        const error: IFormErrors = {};
        if (!inputs.name) error.name = "Name is required";
        if (!inputs.email) error.email = "Email is required";
        if (!inputs.subject) error.subject = "Subject is required";
        if (!inputs.message) error.message = "Message is required";
        if (!inputs.captcha) error.captcha = "Please confirm you are not a robot";
        return error;
    };

    /** Trigger sending once validation passes */
    useEffect(() => {
        if (!isSubmitting) return;
        if (Object.keys(errors).length === 0) {
            sendMail();
        } else {
            setIsSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    /** Update captcha token */
    const onChangeRecaptcha = (value: string | null): void => {
        setInputs((prev) => ({ ...prev, captcha: value ?? false }));
    };

    /** POST the contact form to the API */
    const sendMail = async (): Promise<void> => {
        try {
            setStatus((prev) => ({ ...prev, submitting: true }));
            const res = await fetch(`${server}/api/contact/send/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const text = await res.text();
            handleResponse(res.status, text);
        } catch {
            console.error("Failed to send contact form");
        }
    };

    /** Handle form submission */
    const handleOnSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setErrors(validate());
        setIsSubmitting(true);
    };

    /** Manage page-level CSS classes */
    useEffect(() => {
        document.body.classList.add("contact-page", "sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);

        return () => {
            document.body.classList.remove("contact-page", "sidebar-collapse");
        };
    }, []);

    return (
        <>
            <div className="main contact-main" ref={sectionRef}>
                <div className="contact-content">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="8">
                                <div className="contact-form-card" data-reveal="fade-right">
                                    <span className="contact-category">Say Hello</span>
                                    <h2 className="title">Let&apos;s have a chat!</h2>
                                    <p className="description">
                                        If you want to have a chat about <b>Coffee</b>, <b>PHP</b>, <b>React</b>, <b>Bash(Shellscript)</b> or any <b>new Tecnology</b>, please send
                                        me a message, I will promisse that I will get back to you!
                                        <br />
                                        <br />
                                        Do you want to work with me? Cool! I just ask to add to the header <b>[job-offer]</b>, so my robot can put you as priority in the queue!
                                        <br />
                                    </p>

                                    {isSubmitting ? (
                                        !status.submitted ? (
                                            <Loader active inline="centered" />
                                        ) : (
                                            <Loader inline="centered" />
                                        )
                                    ) : (
                                        <Form id="contact-me" onSubmit={handleOnSubmit}>
                                            <FormGroup>
                                                <label>Your name</label>
                                                <InputGroup className={nameFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons users_circle-08" />
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
                                                        error={errors.name ? { content: "please enter a name", pointing: "left" } : null}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup>
                                                <label>Email address</label>
                                                <InputGroup className={emailFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons ui-1_email-85" />
                                                    </InputGroupText>
                                                    <Form.Field
                                                        id="email"
                                                        control={Input}
                                                        style={{ border: "none" }}
                                                        className="form-control"
                                                        aria-label="Email Here..."
                                                        autoComplete="email"
                                                        placeholder="Email Here..."
                                                        onFocus={() => setEmailFocus(true)}
                                                        onBlur={() => setEmailFocus(false)}
                                                        onChange={handleOnChange}
                                                        value={inputs.email}
                                                        error={errors.email ? { content: "please enter a email", pointing: "left" } : null}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup>
                                                <label>Subject</label>
                                                <InputGroup className={subjectFocus ? "input-group-focus" : ""}>
                                                    <InputGroupText>
                                                        <i className="now-ui-icons design-2_ruler-pencil" />
                                                    </InputGroupText>
                                                    <Form.Field
                                                        id="subject"
                                                        control={Input}
                                                        className="form-control"
                                                        style={{ border: "none" }}
                                                        aria-label="Subject Here..."
                                                        autoComplete="subject"
                                                        placeholder="What's the craic mate?"
                                                        onFocus={() => setSubjectFocus(true)}
                                                        onBlur={() => setSubjectFocus(false)}
                                                        onChange={handleOnChange}
                                                        value={inputs.subject}
                                                        error={
                                                            errors.subject
                                                                ? {
                                                                      content: "please enter a subject",
                                                                      pointing: "left",
                                                                  }
                                                                : null
                                                        }
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
                                                    error={
                                                        errors.message
                                                            ? {
                                                                  content: "please enter a message",
                                                                  pointing: "left",
                                                              }
                                                            : null
                                                    }
                                                />
                                            </FormGroup>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                            <FormGroup>
                                                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_SITE_RECAPTCHA_KEY ?? ""} onChange={onChangeRecaptcha} />
                                                {errors.captcha && <p style={{ color: "red", marginTop: "4px", fontSize: "0.85rem" }}>{errors.captcha}</p>}
                                            </FormGroup>

                                            <div className="submit text-center">
                                                <Button className="contact-submit-btn btn-raised btn-round btn btn-info" type="submit" disabled={status.submitting}>
                                                    {!status.submitting ? (!status.submitted ? "Submit" : "Submitted") : "Submitting..."}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}

                                    {status.info.error && <Message error header="Error" content={status.info.msg} />}
                                    {!status.info.error && status.info.msg && <Message success header="Success" content={status.info.msg} />}
                                </div>
                            </Col>

                            <Col className="ml-auto mr-auto" md="3">
                                <div className="contact-info-cards" data-reveal="fade-left">
                                    <div className="contact-info-card">
                                        <div className="contact-info-icon">
                                            <i className="now-ui-icons location_pin" />
                                        </div>
                                        <div className="description">
                                            <h4 className="info-title">Find me in Cork</h4>
                                            <p>
                                                Camden Court,
                                                <br />
                                                Knaps Square
                                                <br />
                                                Cork
                                            </p>
                                        </div>
                                    </div>
                                    <div className="contact-info-card">
                                        <div className="contact-info-icon">
                                            <i className="now-ui-icons tech_mobile" />
                                        </div>
                                        <div className="description">
                                            <h4 className="info-title">Give me a ring</h4>
                                            <p>
                                                Rafael Mendes
                                                <br />
                                                +353 83 8119 443
                                                <br />
                                                Mon - Fri, 8:00-18:00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <div className="big-map" id="contactUs2Map">
                <MapWrapper googleKey={googleKey} />
            </div>
        </>
    );
};

export default ContactMe;
