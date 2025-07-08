import React from 'react'
import ContactMe from '../components/contact/ContactMe'
import ContactMeHeader from '../components/contact/ContactMeHeader'

export default function ContactMePage (props) {
    const googleKey = process.env.GOOGLE_KEY;

    return (
        <>
            <ContactMeHeader />
            <ContactMe googleKey={googleKey} />
        </>
    )
}

