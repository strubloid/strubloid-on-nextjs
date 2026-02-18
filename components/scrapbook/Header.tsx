import React, { useEffect, useRef } from "react";
import Rellax from "rellax";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const RELLAX_INIT_DELAY_MS = 5000;
const MIN_DESKTOP_WIDTH = 991;

const ScrapbookHeader: React.FC = () => {
    const pageReference = useRef<HTMLDivElement>(null);
    const sectionRef = useScrollReveal();

    useEffect(() => {
        document.body.classList.add("notes-page", "sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);

        if (window.innerWidth >= MIN_DESKTOP_WIDTH) {
            const timer = setTimeout(() => {
                new Rellax(".rellax", { center: true });
            }, RELLAX_INIT_DELAY_MS);

            new Rellax(".rellax-header");
            new Rellax(".rellax-text");

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="page-header page-header-small scrapbook-hero" ref={sectionRef}>
            <div className="page-header-image notes-header" ref={pageReference} />
            <div className="scrapbook-hero-overlay">
                <div className="scrapbook-blob scrapbook-blob-1" />
                <div className="scrapbook-blob scrapbook-blob-2" />
                <h1 className="scrapbook-hero-title" data-reveal="fade-up">
                    Scrapbook
                </h1>
                <p className="scrapbook-hero-subtitle" data-reveal="fade-up" data-reveal-delay="1">
                    Thoughts, ideas &amp; notes
                </p>
            </div>
        </div>
    );
};

export default ScrapbookHeader;
