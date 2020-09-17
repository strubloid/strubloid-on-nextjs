import Head from 'next/head'
import TransparentNavbar from '@components/shared/TransparentNavbar'
import Footer from '@components/shared/Footer'
import Header from '@components/homepage/Header'
import Github from '@components/homepage/Github'

export default function Home () {
    return (
        <>
            <Head>
                <title>Its Strub...Loid!</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
            </Head>
            <TransparentNavbar />
            <div className="wrapper">
                <Header />
                <Github />
            </div>
            <Footer />
        </>
    )
}
