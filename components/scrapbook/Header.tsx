import React, { useEffect, useRef } from "react";
import Rellax from "rellax";

const RELLAX_INIT_DELAY_MS = 5000;
const MIN_DESKTOP_WIDTH = 991;

const ScrapbookHeader: React.FC = () => {
    const pageReference = useRef<HTMLDivElement>(null);

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
        <div className="page-header page-header-small">
            <div className="page-header-image notes-header" ref={pageReference} />
        </div>
    );
};

export default ScrapbookHeader;
