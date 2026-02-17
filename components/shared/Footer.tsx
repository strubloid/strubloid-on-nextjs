import React from "react";
import { Container } from "reactstrap";
import Link from "next/link";

const Footer: React.FC = () => (
    <footer className="footer" data-background-color="black">
        <Container>
            <nav>
                <ul>
                    <li>
                        <Link href="/">Strubloid.com</Link>
                    </li>
                    <li>
                        <Link href="/about-me">About me</Link>
                    </li>
                </ul>
            </nav>
            <div className="copyright" id="copyright">
                MIT License {new Date().getFullYear()} Strubloid.com
            </div>
        </Container>
    </footer>
);

export default Footer;
