import React from "react";
import { Button } from "antd-mobile";
import Timer from "../../utils/Timer";
import classNames from "classnames/bind";

class VeriCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remain: 0
    };
    let that = this;
    this.timer = new Timer({
      hours: 0,
      min: 0,
      seconds: 5,
      format: 's',
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
    this.props.onClick(this.timer);
  }
  render() {
    return (
      <Button onClick={this.onClick} className={classNames({ locked: this.state.remain !== 0 })}>
        {this.state.remain === 0 ? "获取验证码" : `${this.state.remain}秒后重新发送`}
      </Button>
    );
  }
}

export default VeriCode;
