import React, { PropsWithChildren, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import TransparentNavbar from "./shared/TransparentNavbar";
import ExternalImports from "./shared/ExternalImports";
import Footer from "./shared/Footer";
import { useCustomCursor } from "../hooks/useCustomCursor";
import { useScrollProgress } from "../hooks/useScrollProgress";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const router = useRouter();
    const isArtisticPage = router.pathname === "/artistic";
    const showNavbar = !isArtisticPage || scrollY < 100;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useCustomCursor();
    useScrollProgress();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Head>
                <title>Its Strub...Loid!</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-site-verification" content="3nZk6PpSECQPWbqTv8UFJGsn3ibESvm3_6HRSDafX3Y" />
            </Head>
            <ExternalImports />
            {showNavbar && <TransparentNavbar />}
            <div className={`wrapper${mounted ? " page-mounted" : ""}`}>{children}</div>
            {scrollY > 300 && (
                <button
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
            <Footer />
        </>
    );
};

export default Layout;
