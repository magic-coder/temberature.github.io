import React from "react";
import { List } from "antd-mobile";
import "./Profile.less";
import OAIcon from "../components/icon/Icon.js";
import axios from "../utils/customAxios";
import WebConstants from "../web_constants";
import { Map } from "immutable";

const Item = List.Item;

class Profile extends React.Component {
  state = {
    user: Map()
  };
  componentDidMount() {
    document.title = "个人中心";
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    this.getProfile();
  }
  async getProfile() {
    let response = await axios.get("/RetrieveMyProfileDataServlet", {
      params: {
        [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
      }
    });
    console.log(response);
    // data = data.response
    this.setState(() => ({
      user: response.data
    }));
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
          {this.state.user && this.state.user.get("mobilephoneNumber")}
        </header>
        <main>
          <List>
            <Item
              thumb={<OAIcon type={require("./assets/icon_course.svg")} />}
              arrow="horizontal"
              onClick={() => {
                if (this.state.user.get("mobilephoneNumber")) {
                  this.props.history.push("/me/courses");
                } else {
                  this.props.history.push(`/signin?callback=${encodeURIComponent("/me/courses")}`);
                }
              }}
            >
              我的活动
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_invite.svg")} />}
              onClick={() => {
                this.props.history.push("/invitation");
              }}
              arrow="horizontal"
            >
              邀请好友
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_about.svg")} />}
              arrow="horizontal"
              onClick={() => {
                this.props.history.push("/about");
              }}
            >
              关于OA
            </Item>
            <Item
              thumb={<OAIcon type={require("./assets/icon_setting.svg")} />}
              onClick={() => {
                this.props.history.push("/settings");
              }}
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
