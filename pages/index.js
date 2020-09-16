import Head from 'next/head'
import TransparentNavbar from '@components/shared/TransparentNavbar'
import Footer from '@components/shared/Footer'
import Header from '@components/homepage/Header'

export default function Home () {
    return (
        <>
            <Head>
                <title>Its Strub...Loid!</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <TransparentNavbar />
            <div className="wrapper">
                <Header />
            </div>
            <Footer />
        </>
    )
}
