import {  UncontrolledTooltip  } from 'reactstrap';

class StrubloidTooltip extends UncontrolledTooltip {

  timeToBeOpen = 1000;
  updateScreen()
  {
    this.setState({ isOpen: !this.state.isOpen });
  }

  toggle() {
    this.state.isOpen === false
        ? this.updateScreen()
        : setTimeout(() => this.updateScreen(), this.timeToBeOpen);
  }
}

export default StrubloidTooltip;