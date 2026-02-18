import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Rellax from "rellax";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const RELLAX_INIT_DELAY_MS = 5000;
const MIN_DESKTOP_WIDTH = 991;

const MESSAGES = {
    siteName: "Strubloid.com",
    first: "const creativity = await inspire();",
    second: "λ ∞ code.stream().map(light)",
    third: "> git push origin/dreams",
    fourth: "✦ recursion != boring ✦",
} as const;

const Header: React.FC = () => {
    const router = useRouter();
    const revealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
    const scrollIndicatorRef = React.useRef<HTMLDivElement>(null);

    const handleScrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

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

    // Show/hide scroll indicator based on header visibility
    useEffect(() => {
        const indicator = scrollIndicatorRef.current;
        if (!indicator) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    indicator.style.opacity = "1";
                    indicator.style.pointerEvents = "auto";
                } else {
                    indicator.style.opacity = "0";
                    indicator.style.pointerEvents = "none";
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(revealRef.current!);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="page-header page-header-homepage clear-filter" ref={revealRef}>
            {/* Organic background blobs */}
            <div className="organic-blob hero-blob-1" />
            <div className="organic-blob hero-blob-2" />
            <div className="organic-blob hero-blob-3" />

            <div className="rellax-header rellax-header-sky" data-rellax-speed="-4">
                <div className="page-header-image page-header-top">&nbsp;</div>
            </div>
            <div className="rellax-header rellax-header-buildings" data-rellax-speed="0">
                <div className="page-header-image page-header-city">&nbsp;</div>
            </div>
            <div className="rellax-text-container rellax-text" data-rellax-speed="-12">
                <h1 className="h1-seo" data-reveal="fade-up" data-reveal-delay="200">
                    {MESSAGES.siteName}
                </h1>
                <p className="hero-tagline" data-reveal="fade-up" data-reveal-delay="400">
                    Software Engineer &middot; Linux Enthusiast &middot; Photographer &middot; Painter
                </p>

                {/* Navigation buttons */}
                <div className="header-nav-buttons" data-reveal="fade-up" data-reveal-delay="600">
                    <button className="nav-button" onClick={() => handleScrollToSection("github-section")}>
                        IT PART OF ME
                    </button>
                    <button className="nav-button" onClick={() => handleScrollToSection("art-section")}>
                        ARTISTIC OF ME
                    </button>
                </div>
            </div>
            <div id="fly-container">
                {[
                    { text: MESSAGES.first, speed: "15" },
                    { text: MESSAGES.second, speed: "14" },
                    { text: MESSAGES.third, speed: "15" },
                    { text: MESSAGES.fourth, speed: "14" },
                ].map(({ text, speed }, idx) => (
                    <div
                        key={text}
                        className="fly-description rellax-text quote-wrapper hovicon auto-width effect-4 sub-b"
                        data-rellax-speed={speed}
                        data-reveal="fade-scale"
                        data-reveal-delay={String(600 + idx * 150)}
                    >
                        <blockquote className="text">
                            <p>{text}</p>
                        </blockquote>
                    </div>
                ))}
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator" ref={scrollIndicatorRef}>
                <div className="scroll-indicator-dot" />
                <span>Scroll to explore</span>
            </div>
        </div>
    );
};

export default Header;
