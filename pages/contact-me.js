import Head from 'next/head'
import TransparentNavbar from '@components/shared/TransparentNavbar'
import Footer from '@components/shared/Footer'
import ExternalImports from '@components/shared/ExternalImports'
import ContactMe from '@components/contact-me/ContactMe'
import React from 'react'

export default function Home () {
    return (
        <>
            <Head>
                <title>Its time to contact... wait for it... ME!</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExternalImports />
            <TransparentNavbar />
            <div className="wrapper">
                <ContactMe />
            </div>
            <Footer />
        </>
    )
}

