import React, { useEffect } from "react";
import Rellax from "rellax";

const RELLAX_INIT_DELAY_MS = 5000;
const MIN_DESKTOP_WIDTH = 991;

const MESSAGES = {
    siteName: "Strubloid.com",
    first: "A mix between lines of code and light!",
    second: 'Import { positivism } from "proton.lib"',
    third: "$ Git push [your-code] me",
    fourth: "while (live) alias everywhere!",
} as const;

const Header: React.FC = () => {
    useEffect(() => {
        document.body.classList.add("presentation-page", "sidebar-collapse");
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
        <div className="page-header page-header-homepage clear-filter">
            <div className="rellax-header rellax-header-sky" data-rellax-speed="-4">
                <div className="page-header-image page-header-top">&nbsp;</div>
            </div>
            <div className="rellax-header rellax-header-buildings" data-rellax-speed="0">
                <div className="page-header-image page-header-city">&nbsp;</div>
            </div>
            <div className="rellax-text-container rellax-text" data-rellax-speed="-12">
                <h1 className="h1-seo">{MESSAGES.siteName}</h1>
            </div>
            <div id="fly-container">
                {[
                    { text: MESSAGES.first, speed: "15" },
                    { text: MESSAGES.second, speed: "14" },
                    { text: MESSAGES.third, speed: "15" },
                    { text: MESSAGES.fourth, speed: "14" },
                ].map(({ text, speed }) => (
                    <div key={text} className="fly-description rellax-text quote-wrapper hovicon auto-width effect-4 sub-b" data-rellax-speed={speed}>
                        <blockquote className="text">
                            <p>{text}</p>
                        </blockquote>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Header;
