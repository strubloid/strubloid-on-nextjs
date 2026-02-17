import React, { PropsWithChildren } from "react";
import Head from "next/head";
import TransparentNavbar from "./shared/TransparentNavbar";
import ExternalImports from "./shared/ExternalImports";
import Footer from "./shared/Footer";

const Layout: React.FC<PropsWithChildren> = ({ children }) => (
    <>
        <Head>
            <title>Its Strub...Loid!</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="google-site-verification" content="3nZk6PpSECQPWbqTv8UFJGsn3ibESvm3_6HRSDafX3Y" />
        </Head>
        <ExternalImports />
        <TransparentNavbar />
        <div className="wrapper">{children}</div>
        <Footer />
    </>
);

export default Layout;
