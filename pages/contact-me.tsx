import React from "react";
import type { NextPage } from "next";
import ContactMe from "../components/contact/ContactMe";
import ContactMeHeader from "../components/contact/ContactMeHeader";

const ContactMePage: NextPage = () => {
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;

    return (
        <>
            <ContactMeHeader />
            <ContactMe googleKey={googleKey} />
        </>
    );
};

export default ContactMePage;
