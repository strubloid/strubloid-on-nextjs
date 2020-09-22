import ContactMe from '@components/contact-me/ContactMe'
import React from 'react'
import ContactMeHeader from '@components/contact-me/ContactMeHeader'

export default function ContactMePage (props) {
    const googleKey = process.env.GOOGLE_KEY;

    return (
        <>
            <ContactMeHeader />
            <ContactMe googleKey={googleKey} />
        </>
    )
}

