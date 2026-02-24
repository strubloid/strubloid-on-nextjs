import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, Nav } from "reactstrap";
import StrubloidTooltip from "./StrubloidTooltip";

const SCROLL_THRESHOLD = 500;
const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe

const ScrollTransparentNavbar: React.FC = () => {
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [navbarColor, setNavbarColor] = useState(" navbar-transparent");
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const scrollPositionRef = useRef<number>(0);

    const updateNavbarColor = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop;
        setNavbarColor(scrollTop > SCROLL_THRESHOLD ? "" : " navbar-transparent");
    }, []);

    const toggleNavOpen = useCallback(() => {
        const isOpening = !collapseOpen;

        if (isOpening) {
            // Save scroll position before opening menu
            scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
        } else {
            // Restore scroll position after closing menu
            setTimeout(() => {
                window.scrollTo(0, scrollPositionRef.current);
            }, 0);
        }

        document.documentElement.classList.toggle("nav-open");
        setCollapseOpen((prev) => !prev);
    }, [collapseOpen]);

    // Handle swipe gestures for mobile
    const handleTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        // Calculate swipe distance
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = touchStartY.current - touchEndY;

        // Only trigger swipe if horizontal movement is greater than vertical (prevent interference with scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
            // Right to left swipe (positive deltaX) - open navbar
            if (deltaX > 0 && !collapseOpen) {
                toggleNavOpen();
            }
            // Left to right swipe (negative deltaX) - close navbar
            if (deltaX < 0 && collapseOpen) {
                toggleNavOpen();
            }
        }
    }, [collapseOpen, toggleNavOpen]);

    useEffect(() => {
        updateNavbarColor();
        window.addEventListener("scroll", updateNavbarColor);
        document.addEventListener("touchstart", handleTouchStart as EventListener);
        document.addEventListener("touchend", handleTouchEnd as EventListener);
        return () => {
            window.removeEventListener("scroll", updateNavbarColor);
            document.removeEventListener("touchstart", handleTouchStart as EventListener);
            document.removeEventListener("touchend", handleTouchEnd as EventListener);
        };
    }, [updateNavbarColor, handleTouchStart, handleTouchEnd]);

    return (
        <>
            {collapseOpen && <div id="bodyClick" onClick={toggleNavOpen} />}
            <Navbar className={`fixed-top${navbarColor}`} color="white" expand="lg">
                <div className="navbar-translate">
                    <NavbarBrand href="/" id="navbar-brand">
                        Rafael Mendes
                    </NavbarBrand>
                    <StrubloidTooltip target="navbar-brand">
                        <div style={{ marginBottom: "0.5rem" }}>
                            If you want to know more, keep checking the whole progress of the website on:{" "}
                            <a href="https://github.com/strubloid/strubloid-on-nextjs" target="_blank" rel="noopener noreferrer">
                                click here
                            </a>
                        </div>
                        <div style={{ paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.3)" }}>
                            <Link href="/website" style={{ color: "#FFD700", textDecoration: "underline", fontWeight: "bold" }}>
                                /Website
                            </Link>
                        </div>
                    </StrubloidTooltip>
                    <button onClick={toggleNavOpen} aria-expanded={collapseOpen} className="navbar-toggler">
                        <span className="navbar-toggler-bar top-bar" />
                        <span className="navbar-toggler-bar middle-bar" />
                        <span className="navbar-toggler-bar bottom-bar" />
                    </button>
                </div>
                <Collapse isOpen={collapseOpen} navbar>
                    <Nav className="ml-auto" id="ceva" navbar>
                        <NavItem>
                            <Button className="nav-link btn-default" color="neutral" href="/about-me">
                                <i aria-hidden={true} className="now-ui-icons design_image" />
                                <p>IT Part of me</p>
                            </Button>
                        </NavItem>
                        <NavItem>
                            <Button className="nav-link btn-default" color="neutral" href="/artistic">
                                <i aria-hidden={true} className="now-ui-icons design_palette" />
                                <p>Artistic Of Me</p>
                            </Button>
                        </NavItem>
                        <NavItem>
                            <Button className="nav-link btn-default" color="neutral" href="/contact-me">
                                <i aria-hidden={true} className="now-ui-icons location_pin" />
                                <p>Contact Me</p>
                            </Button>
                        </NavItem>
                        <NavItem>
                            <Button className="nav-link btn-default" color="neutral" href="https://www.linkedin.com/in/strubloid/" target="_blank">
                                <p>Linkedin</p>
                            </Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </>
    );
};

export default ScrollTransparentNavbar;
