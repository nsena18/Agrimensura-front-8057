import React, { Component } from "react";

class SidebarMinimizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false
    };
  }

  sidebarMinimize() {
    document.body.classList.toggle("sidebar-minimized");
    document.body.classList.toggle("brand-minimized");
  }

  onButtonClick = () => {
    this.setState(prevState => {
      this.props.onSidebarMinimize(!prevState.minimized);
      return { minimized: !prevState.minimized }
    });
    this.sidebarMinimize();
  }

  render() {
    return (
      <button
        className="sidebar-minimizer"
        type="button"
        onClick={this.onButtonClick}
      />
    );
  }
}

export default SidebarMinimizer;
