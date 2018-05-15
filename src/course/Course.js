import React from "react";
import Moment from "moment";
import axios from "../utils/customAxios";
import { Button, List, Badge, WhiteSpace, Tabs } from "antd-mobile";
import OAIcon from "../components/icon/Icon.js";
import Period from "../components/period/Period";
import "./Course.less";
import WebConstants from "../web_constants";
import { Map, Marker } from "react-amap";
import { Link } from "react-router-dom";

const Item = List.Item;

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {},
      already_joined_event: false
    };
  }
  componentDidMount() {
    document.title = "OA学院";

    axios
      .get("/RetrieveEventByEventIdServlet", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
      .then(response => {
        console.log(response);

        this.setState(() => ({
          course: response.data
        }));
      })
      .catch(function(error) {
        console.log(error);
      });
    if (!sessionStorage.getItem(WebConstants.TOKEN)) {
      console.log(111);
      return;
    }
    axios
      .get("/RetrieveEventParticipantsServlet", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        },
        validateStatus: function(status) {
          return +status === 200;
        }
      })
      .then(response => {
        console.log(response);
        if (response.data.already_joined_event) {
          this.setState(() => ({
            already_joined_event: true
          }));
        }
      })
      .catch(function(error) {
        if (!error.response) {
          sessionStorage.removeItem(WebConstants.TOKEN);
        }
      });
  }
  generateNewLine(inString) {
    if (inString !== null && typeof inString !== "undefined") {
      let outString = inString.replace(/\n/g, "<br/>");
      outString = outString.replace(/\r/g, "<br/>");
      return outString;
    }
  }
  toEntry = () => {
    if (!sessionStorage.getItem(WebConstants.TOKEN)) {
      this.props.history.push("/signin");
    } else {
      this.props.history.push(this.props.match.url + "/entryForm");
    }
  };
  render() {
    const course = this.state.course;
    const tabs = [{ title: "活动详情" }, { title: <Badge>共享空间</Badge> }];

    return (
      <div key={course.id} id="course">
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log("onChange", index, tab);
          }}
          onTabClick={(tab, index) => {
            console.log("onTabClick", index, tab);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "#fff"
            }}
          >
            <div className="coverContainer">
              <div
                style={{
                  backgroundImage:
                    "url(https://www.jieshu.mobi:8181" +
                    course.event_frontcover_filepath +
                    ")"
                }}
                className="blurCover"
              />
              <img
                className="cover"
                src={
                  "https://www.jieshu.mobi:8181" +
                  course.event_frontcover_filepath
                }
                alt=""
              />
            </div>

            <div className="info">
              <div className="title">
                <span className="name">{course.title}</span>
              </div>
              <div className="deadline">
                报名截止至：{Moment(course.event_start_date).format(
                  "YYYY/MM/DD"
                )}
                <Period
                  course={course}
                  images={[
                    require("./assets/period_enrolling.png"),
                    require("./assets/period_ongoing.png"),
                    require("./assets/period_finish.png")
                  ]}
                />
              </div>
              <List>
                <Item
                  extra={
                    "已报" +
                    course.enrolled_already +
                    "人/限制" +
                    course.max_attendence +
                    "人"
                  }
                >
                  报名人数
                </Item>
                <Item
                  extra={
                    Moment(course.startDate).format("YYYY/MM/DD") +
                    " ~ " +
                    Moment(course.endDate).format("YYYY/MM/DD")
                  }
                  wrap
                >
                  活动时间
                </Item>
                <Item
                  extra={
                    <Link to={this.props.match.url + "/map"}>
                      <div>
                        <OAIcon
                          size="xxs"
                          style={{ color: "#9b9b9b" }}
                          type={require("../assets/icon_place.svg")}
                        />
                        {course.address}
                      </div>
                    </Link>
                  }
                  arrow="horizontal"
                >
                  活动地点
                </Item>
                <Item extra="免费">费用</Item>
              </List>
              <div
                className="detail"
                dangerouslySetInnerHTML={{
                  __html: course.event_main_content
                    ? this.generateNewLine(course.event_main_content)
                    : "活动详情"
                }}
              />
            </div>

            {new Date().getTime() < course.event_register_deadline &&
              (this.state.already_joined_event ? (
                <Button
                  disabled
                  className="enrollBtn"
                  type="primary"
                  size="large"
                >
                  已报名
                </Button>
              ) : (
                <Button
                  className="enrollBtn"
                  type="primary"
                  size="large"
                  onClick={this.toEntry}
                >
                  立即报名
                </Button>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              height: "300px"
            }}
          >
            敬请期待
          </div>
        </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}
