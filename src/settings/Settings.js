import React from "react";
import { List, Button, Toast } from "antd-mobile";
import "./Settings.less";
import WebConstants from "../web_constants";

const Item = List.Item;

class Settings extends React.Component {
  componentDidMount() {
    document.title = "设置";
  }
  logout = () => {
    sessionStorage.removeItem(WebConstants.TOKEN);
    Toast.success("注销成功", 1, () => {
      this.props.history.push("/");
    });
  };
  render() {
    return (
      <div id="settings">
        <List>
          <Item
            arrow="horizontal"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            帮助与反馈
          </Item>
        </List>
        <Button onClick={this.logout} className="logoutBtn">
          退出登录
        </Button>
      </div>
    );
  }
}

export default Settings;
