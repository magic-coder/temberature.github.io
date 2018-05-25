import React from "react";
import "./TabBar.less";
import { NavLink } from "react-router-dom";
import OAIcon from "../icon/Icon";
class OATabBar extends React.Component {
  render() {
    return (
      <div className="oa-tabbar is-fixed">
        <NavLink exact to="/" className="oa-tab-item">
          <div className="oa-tab-item-icon">
            <OAIcon type={this.props.icons[0]} />
          </div>
          <div className="oa-tab-item-label">{this.props.titles[0]}</div>
        </NavLink>
        <NavLink to="/profile" className="oa-tab-item">
          <div className="oa-tab-item-icon">
            <OAIcon type={this.props.icons[1]} />
          </div>
          <div className="oa-tab-item-label">{this.props.titles[1]}</div>
        </NavLink>
      </div>
    );
  }
}

export default OATabBar;
