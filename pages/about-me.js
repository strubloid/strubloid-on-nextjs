import Head from 'next/head'
import TransparentNavbar from '@components/shared/TransparentNavbar'
import Footer from '@components/shared/Footer'
import ExternalImports from '@components/shared/ExternalImports'
import Header from '@components/homepage/Header'
import Github from '@components/homepage/Github'
import AboutMe from '@components/homepage/AboutMe'
import React from 'react'

export default function Home () {
    return (
        <>
            <Head>
                <title>Its Strub...Loid!</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExternalImports />
            <TransparentNavbar />
            <div className="wrapper">

                <AboutMe />
            </div>
            <Footer />
        </>
    )
}
