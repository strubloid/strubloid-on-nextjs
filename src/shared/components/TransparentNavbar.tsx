import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavItem, Nav } from "reactstrap";
import StrubloidTooltip from "./StrubloidTooltip";

const SCROLL_THRESHOLD = 500;

const ScrollTransparentNavbar: React.FC = () => {
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [navbarColor, setNavbarColor] = useState(" navbar-transparent");

    const updateNavbarColor = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop;
        setNavbarColor(scrollTop > SCROLL_THRESHOLD ? "" : " navbar-transparent");
    }, []);

    useEffect(() => {
        updateNavbarColor();
        window.addEventListener("scroll", updateNavbarColor);
        return () => window.removeEventListener("scroll", updateNavbarColor);
    }, [updateNavbarColor]);

    const toggleNavOpen = useCallback(() => {
        document.documentElement.classList.toggle("nav-open");
        setCollapseOpen((prev) => !prev);
    }, []);

    return (
        <>
            {collapseOpen && <div id="bodyClick" onClick={toggleNavOpen} />}
            <Navbar className={`fixed-top${navbarColor}`} color="white" expand="lg">
                <div className="navbar-translate">
                    <NavbarBrand href="/" id="navbar-brand">
                        Rafael Mendes
                    </NavbarBrand>
                    <StrubloidTooltip target="navbar-brand">
                        If you want to know more, keep checking the whole progress of the website on:{" "}
                        <a href="https://github.com/strubloid/strubloid-on-nextjs" target="_blank" rel="noopener noreferrer">
                            click here
                        </a>
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
