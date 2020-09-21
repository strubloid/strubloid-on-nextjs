import React, { Component } from "react";
import Rellax from "rellax";

class BasicHeader extends Component {

  constructor (props) {

    super(props);

    this.pageReference = React.createRef();
  }

  render() {
    return (
        <>
          <div className="page-header page-header-small">
            <div className="page-header-image" ref={this.pageReference} ></div>
          </div>
        </>
    );
  }
}

export default BasicHeader;