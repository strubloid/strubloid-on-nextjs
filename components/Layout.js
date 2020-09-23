import Head from 'next/head'
import TransparentNavbar from '@components/shared/TransparentNavbar'
import ExternalImports from '@components/shared/ExternalImports'
import Footer from '@components/shared/Footer'
import React from 'react'

const Layout = ({ children }) => (
    <>
        <Head>
            <title>Its Strub...Loid!</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="google-site-verification" content="3nZk6PpSECQPWbqTv8UFJGsn3ibESvm3_6HRSDafX3Y" />
        </Head>
        <ExternalImports />
        <TransparentNavbar />
            <div className="wrapper">
                {children}
            </div>
        <Footer />
    </>
)

export default Layout;