import React from "react";
import { Container } from "reactstrap";
import Link from "next/link";

const Footer: React.FC = () => (
    <footer className="footer footer-modern" data-background-color="black">
        <Container>
            <div className="footer-content">
                <div className="footer-brand-section">
                    <h4 className="footer-brand-name">Strubloid.com</h4>
                    <p className="footer-tagline">Building digital experiences with passion, one line of code at a time.</p>
                </div>
                <nav className="footer-nav-section">
                    <h6 className="footer-nav-title">Navigate</h6>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/about-me">About me</Link>
                        </li>
                        <li>
                            <Link href="/contact-me">Contact</Link>
                        </li>
                    </ul>
                </nav>
                <div className="footer-social-section">
                    <h6 className="footer-nav-title">Connect</h6>
                    <div className="social-links">
                        <a href="https://github.com/strubloid" target="_blank" rel="noopener noreferrer" aria-label="Github">
                            <i className="fab fa-github" />
                        </a>
                        <a href="https://www.linkedin.com/in/strubloid/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="copyright" id="copyright">
                    MIT License &copy; {new Date().getFullYear()} Rafael Mendes
                </div>
                <div className="footer-accent-line" />
            </div>
        </Container>
    </footer>
);

export default Footer;
