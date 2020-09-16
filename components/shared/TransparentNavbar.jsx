import React, { Component } from 'react';
import Link from 'next/link'

import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
} from "reactstrap";

import StrubloidTooltip from "./StrubloidTooltip"

class ScrollTransparentNavbar extends Component {
  state = {
    collapseOpen : false,
    navbarColor : ""
  }
  // fixed-top navbar-transparent navbar navbar-expand-lg bg-white
  // fixed-top navbar navbar-expand-lg bg-white
  componentDidMount = () => {
    this.state.navbarColor = (document.documentElement.scrollTop > 499 || document.body.scrollTop) > 499 ? "" :  " navbar-transparent";
    this.setState({ navbarColor : this.state.navbarColor});
  }

  render () {
    return (
        <>
          {this.state.collapseOpen ? (
              <div
                  id="bodyClick"
                  onClick={() => {
                    document.documentElement.classList.toggle("nav-open");
                    this.setState({collapseOpen : false})
                  }}
              />
          ) : null}
          <Navbar className={"fixed-top" + this.state.navbarColor} color="white" expand="lg">
            <Container>
              <div className="navbar-translate">
                <NavbarBrand href="/" id="navbar-brand">
                  Rafael Mendes
                </NavbarBrand>
                <StrubloidTooltip target="navbar-brand">
                  If you want to know more, keep checking the whole progress of the website on:
                  <a href="https://github.com/strubloid/strubloid.com" target="_blank">click here</a>
                </StrubloidTooltip>
                <button
                    onClick={() => {
                      document.documentElement.classList.toggle("nav-open");
                      setCollapseOpen(!collapseOpen);
                    }}
                    aria-expanded={this.state.collapseOpen}
                    className="navbar-toggler"
                >
                  <span className="navbar-toggler-bar top-bar"></span>
                  <span className="navbar-toggler-bar middle-bar"></span>
                  <span className="navbar-toggler-bar bottom-bar"></span>
                </button>
              </div>
              <Collapse isOpen={this.state.collapseOpen} navbar>
                <Nav className="ml-auto" id="ceva" navbar>
                  <UncontrolledDropdown nav>
                    <DropdownToggle
                        caret
                        color="default"
                        data-toggle="dropdown"
                        href="#pablo"
                        id="navbarDropdownMenuLink"
                        nav
                        onClick={(e) => e.preventDefault()}
                    >
                      <i
                          aria-hidden={true}
                          className="now-ui-icons design_image"
                      ></i>
                      <p>IT Part of me</p>
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="navbarDropdownMenuLink" right>
                      <DropdownItem href="/about-me">
                        <i className="now-ui-icons business_bulb-63"></i>
                        Who is IT Raf?
                      </DropdownItem>
                      <DropdownItem href="/blog-posts">
                        <i className="now-ui-icons design_bullet-list-67"></i>
                        Blog
                      </DropdownItem>
                      <DropdownItem href="/contact-me">
                        <i className="now-ui-icons location_pin"></i>
                        Contact Me!
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <NavItem>
                    <Button
                        className="nav-link btn-default"
                        color="neutral"
                        href="https://www.linkedin.com/in/strubloid/"
                        target="_blank"
                    >
                      <p>Linkedin</p>
                    </Button>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        </>
    );
  }
}

export default ScrollTransparentNavbar;
