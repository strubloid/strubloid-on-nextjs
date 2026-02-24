import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ContactMe, ContactMeHeader } from "@features/contact/components";

const ContactMePage: NextPage = () => {
    const googleKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(window.location.hostname === "localhost");
    }, []);

    // Skip rendering ContactMe on localhost if googleKey is not available
    const shouldSkipContactMe = isLocalhost && !googleKey;

    return (
        <>
            <ContactMeHeader />
            {shouldSkipContactMe ? (
                <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "400px" }}>
                    <p>Contact form is not available on localhost. Please set NEXT_PUBLIC_GOOGLE_KEY in .env to enable.</p>
                </div>
            ) : (
                <ContactMe googleKey={googleKey} />
            )}
        </>
    );
};

export default ContactMePage;
