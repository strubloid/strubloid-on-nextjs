import React from "react";
import { Container } from "reactstrap";
import Link from 'next/link'

function Footer() {
  return (
    <>
      <footer className="footer" data-background-color="black">
        <Container>
          <nav>
            <ul>
              <li>
                <Link href="/">
                  Strubloid.com
                </Link>
              </li>
              <li>
                <Link href="/about-me">
                  About me
                </Link>
              </li>
              {/*<li>*/}
              {/*  <Link href="/blog-posts">*/}
              {/*    <a >Blog</a>*/}
              {/*  </Link>*/}
              {/*</li>*/}
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            MIT License {new Date().getFullYear()} Strubloid.com
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
