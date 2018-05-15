import React from "react";
import { Button } from "antd-mobile";
import Timer from "../../utils/Timer";

class VeriCode extends React.Component {
  constructor() {
    super();
    this.state = {
      remain: 0
    };
    let that = this;
    this.timer = new Timer({
      hours: 0,
      min: 0,
      seconds: 5,
      remainFormat: 'hh:mm:ss',
      onStart: function() {
        that.setState({
          remain: this.remain
        });
      },
      onTick: function() {
        that.setState({
          remain: this.remain
        });
        console.log(this.remain);
      },
      onFinish: () => {
        console.log("finished");
        that.setState({
          remain: 0
        })
      }
    });
  }
  onClick = () => {
    this.timer.start();
    this.props.onClick();
  }
  render() {
    return (
      <Button onClick={this.onClick}>
        {this.state.remain === 0 ? "获取验证码" : this.state.remain + '秒后重新发送'}
      </Button>
    );
  }
}

export default VeriCode;
