import React, { Component } from "react";
import Rellax from "rellax";

class Header extends Component {

  homepageName = 'Strubloid.com';
  firstMessage = 'A mix between lines of code and light!';

  componentDidMount () {
    document.body.classList.add("presentation-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    // initialise Rellax for this page
    if (window.innerWidth >= 991) {
      setTimeout(function () {
        new Rellax(".rellax", {
          center: true,
        });
      }, 5000);
      new Rellax(".rellax-header");
      new Rellax(".rellax-text");
    }
  }

  render() {
    return (
        <>
          <div className="page-header page-header-homepage clear-filter">
            <div className="rellax-header rellax-header-sky" data-rellax-speed="-4">
              <div className="page-header-image page-header-top">&nbsp;</div>
            </div>
            <div className="rellax-header rellax-header-buildings"data-rellax-speed="0">
              <div className="page-header-image page-header-city">&nbsp;</div>
            </div>
            <div className="rellax-text-container rellax-text" data-rellax-speed="-5" >
              <h1 className="h1-seo" >{this.homepageName}</h1>
            </div>
            <h3 className="h3-description rellax-text" data-rellax-speed="5">
              {this.firstMessage}
            </h3>
          </div>
        </>
    );
  }
}

export default Header;