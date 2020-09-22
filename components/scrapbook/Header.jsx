import React, { Component } from "react";
import Rellax from "rellax";

class Header extends Component {

  componentDidMount () {
    document.body.classList.add("notes-page");
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

  constructor (props) {

    super(props);

    this.pageReference = React.createRef();
  }

  render() {
    return (
        <>
          <div className="page-header page-header-small">
            <div className="page-header-image notes-header" ref={this.pageReference} ></div>
          </div>
        </>
    );
  }
}

export default Header;