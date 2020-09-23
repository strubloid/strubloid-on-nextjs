import React, { useState } from 'react'

// reactstrap components
import {
    Button,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
} from "reactstrap";

// Reacptcha
import ReCAPTCHA from "react-google-recaptcha"
import { MapWrapper } from "@components/contact/MapWrapper"
import { server } from '@components/shared/Server';
import fetch from 'isomorphic-unfetch';

const ContactMe = (props) => {

    const [nameFocus, setNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [numberFocus, setNumberFocus] = React.useState(false);

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: {error: false, msg: null}
    });

    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleResponse = (status, msg) => {
        console.log('== RESPONSE ==');
        console.log(status);
        console.log(msg);
        console.log('== RESPONSE ==');
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: {error: false, msg: msg}
            })
            setInputs({
                name: '',
                email: '',
                subject: '',
                message: ''
            })
        } else {
            setStatus({
                info: {error: true, msg: msg}
            })
        }
    };

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

    const handleOnSubmit = async e => {
        e.preventDefault()
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
    };

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
                                <Form onSubmit={handleOnSubmit}>
                                    <label>Your name</label>
                                    <InputGroup className={nameFocus ? "input-group-focus" : ""}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="now-ui-icons users_circle-08"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            id="name"
                                            aria-label="Your Name..."
                                            autoComplete="name"
                                            placeholder="Your Name..."
                                            type="text"
                                            onFocus={() => setNameFocus(true)}
                                            onBlur={() => setNameFocus(false)}
                                            onChange={handleOnChange}
                                            value={inputs.name}
                                        ></Input>
                                    </InputGroup>
                                    <label>Email address</label>
                                    <InputGroup className={emailFocus ? "input-group-focus" : ""}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="now-ui-icons ui-1_email-85"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            id="email"
                                            aria-label="Email Here..."
                                            autoComplete="email"
                                            placeholder="Email Here..."
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                            onChange={handleOnChange}
                                            value={inputs.email}
                                        ></Input>
                                    </InputGroup>
                                    <label>Subject</label>
                                    <InputGroup className={numberFocus ? "input-group-focus" : ""}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="now-ui-icons tech_mobile"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            id="subject"
                                            autoComplete="subject"
                                            placeholder="What's the craic mate?"
                                            type="text"
                                            onFocus={() => setNumberFocus(true)}
                                            onBlur={() => setNumberFocus(false)}
                                            onChange={handleOnChange}
                                            value={inputs.subject}
                                        ></Input>
                                    </InputGroup>
                                    <FormGroup>
                                        <label>Your message</label>
                                        <Input
                                            id="message"
                                            rows="6"
                                            type="textarea"
                                            onChange={handleOnChange}
                                            value={inputs.message}
                                        ></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <ReCAPTCHA sitekey={process.env.SITE_RECAPTCHA_KEY} />
                                    </FormGroup>
                                    <div className="submit text-center">
                                        <button className="btn-raised btn-round btn btn-info"
                                                defaultValue="Contact Us"
                                                type="submit" disabled={status.submitting}>
                                            {
                                                !status.submitting
                                                    ? !status.submitted
                                                    ? 'Submit'
                                                    : 'Submitted'
                                                    : 'Submitting...'
                                            }
                                        </button>
                                    </div>
                                </Form>
                                {status.info.error && (
                                    <div className="error">Error: {status.info.msg}</div>
                                )}
                                {!status.info.error && status.info.msg && (
                                    <div className="success">{status.info.msg}</div>
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
                <MapWrapper
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${props.googleKey}`}
                    loadingElement={<div style={{height: `100%`}} />}
                    containerElement={<div style={{height: `100%`}} />}
                    mapElement={<div style={{height: `100%`}} />}
                />
            </div>
        </>
    );
}

export default ContactMe;
