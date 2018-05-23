import React from "react";
import { Button } from "antd-mobile";
import classNames from "classnames/bind";
import Countdown from "../../utils/Countdown";

class VeriCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remain: 0
    };
    this.start = this.start.bind(this);
  }
  start() {
    let that = this;
    return new Countdown(
      '5',
      function(seconds) {
        that.setState({
          remain: seconds
        });
      },
      function() {
        that.setState({
          remain: 0
        });
      }
    );
  }
  onClick = () => {
    this.props.onClick(this.start);
  };
  render() {
    return (
      <Button
        onClick={this.onClick}
        className={classNames({ locked: this.state.remain !== 0 })}
      >
        {this.state.remain === 0
          ? "获取验证码"
          : `${this.state.remain}秒后重新发送`}
      </Button>
    );
  }
}

export default VeriCode;
