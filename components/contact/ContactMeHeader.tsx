import React, { useEffect, useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const MIN_DESKTOP_WIDTH = 991;
const PARALLAX_FACTOR = 3;

const ContactMeHeader: React.FC = () => {
    const pageHeader = useRef<HTMLDivElement>(null);
    const sectionRef = useScrollReveal();

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
        <div className="page-header page-header-small contact-hero" ref={sectionRef}>
            <div className="page-header-image contact-me-header" ref={pageHeader} />
            <div className="contact-hero-overlay">
                <div className="contact-hero-blob contact-blob-1" />
                <div className="contact-hero-blob contact-blob-2" />
                <h1 className="contact-hero-title" data-reveal="fade-up">
                    Get In Touch
                </h1>
                <p className="contact-hero-subtitle" data-reveal="fade-up" data-reveal-delay="1">
                    Let&apos;s build something amazing together
                </p>
            </div>
        </div>
    );
};

export default ContactMeHeader;
