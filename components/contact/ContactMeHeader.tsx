import React, { useEffect, useRef } from "react";

const MIN_DESKTOP_WIDTH = 991;
const PARALLAX_FACTOR = 3;

const ContactMeHeader: React.FC = () => {
    const pageHeader = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.innerWidth <= MIN_DESKTOP_WIDTH) return;

        const updateScroll = (): void => {
            const windowScrollTop = window.pageYOffset / PARALLAX_FACTOR;
            if (pageHeader.current) {
                pageHeader.current.style.transform = `translate3d(0, ${windowScrollTop}px, 0)`;
            }
        };

        window.addEventListener("scroll", updateScroll);
        return () => window.removeEventListener("scroll", updateScroll);
    }, []);

    return (
        <div className="page-header page-header-small">
            <div className="page-header-image contact-me-header" ref={pageHeader} />
        </div>
    );
};

export default ContactMeHeader;
