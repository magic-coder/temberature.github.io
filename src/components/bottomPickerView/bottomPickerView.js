import React from "react";
import RMCPopupCascader from "rmc-cascader/lib/Popup";
import RMCCascader from "rmc-cascader/lib/Cascader";
import "./bottomPickerView.less";
import "rmc-picker/assets/index.css";
import "rmc-cascader/assets/index.css";
import "rmc-picker/assets/popup.css";

class BottomPickerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  onDismiss = () => {
    console.log("onDismiss");
    this.setState({
      visible: false
    });
  };
  onOk = value => {
    console.log("onChange", value);
    this.setState({
      value,
      visible: false
    });
  };
  render() {
    let cascader = (
      <RMCCascader
        data={this.props.data}
        // onChange={this.onChange}
        rootNativeProps={{ "data-xx": "yy" }}
        cols={1}
      />
    );
    return (
      <RMCPopupCascader
        cascader={cascader}
        onDismiss={this.onDismiss}
        onOk={this.onOk}
        visible={this.props.visible}
        dismissText={"取消"}
        okText={"确认"}
        cols={1}
        {...this.props}
      />
    );
  }
}

export default BottomPickerView;
