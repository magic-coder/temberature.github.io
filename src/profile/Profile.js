import React from "react";
import { List, Icon } from "antd-mobile";
import "./Profile.less";
import OAIcon from "../components/icon/Icon";
import axios from "../utils/customAxios";
import WebConstants from '../web_constants'

const Item = List.Item;

class Profile extends React.Component {
  state = {
    user: {}
  }
  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    axios
      .get(
        "/RetrieveMyProfileDataServlet", {
          params: {
            [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
          }
        }
      )
      .then(response => {
        console.log(response);
        // data = data.response
        this.setState(() => ({
          user: response.data
        }));
      });
  }
  render() {
    return (
      <div id="profile">
        <header>
          <img
            className="avatar"
            src={require("./assets/avatar_default.png")}
            alt=""
          />
          {this.state.user.mobilephoneNumber}
        </header>
        <main>
          <List>
            <Item
              thumb={<OAIcon type={require("./assets/icon_course.svg")} />}
              arrow="horizontal"
              onClick={() => {}}
            >
              我的活动
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_invite.svg")} />}
              onClick={() => {}}
              arrow="horizontal"
            >
              邀请好友
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_about.svg")} />}
              arrow="horizontal"
              onClick={() => {}}
            >
              关于OA
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_setting.svg")} />}
              onClick={() => {}}
              arrow="horizontal"
            >
              设置
            </Item>
          </List>
        </main>
      </div>
    );
  }
}

export default Profile;
