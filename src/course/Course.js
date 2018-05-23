import React from "react";
import Moment from "moment";
import axios from "../utils/customAxios";
import {
  Button,
  List,
  Badge,
  WhiteSpace,
  Tabs,
  Accordion,
  Modal
} from "antd-mobile";
import BottomPickerView from "../components/bottomPickerView/bottomPickerView";
import OAIcon from "../components/icon/Icon.js";
import Period from "../components/period/Period";
import "./Course.less";
import WebConstants from "../web_constants";
import { Link } from "react-router-dom";
import { Map, is } from "immutable";

const Item = List.Item;
const alert = Modal.alert;

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: Map(),
      space: Map(),
      already_joined_event: false,
      pickerVisible: false
    };
  }

  componentDidMount() {
    document.title = "课程主页";
    this.props.onCourseInit(+this.props.match.params.id);
    this.getData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    const thisState = this.state || {};
    nextState = nextState || {};
    nextProps = nextProps || {};

    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }

    for (const key in nextProps) {
      if (!is(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    for (const key in nextState) {
      if (!is(thisState[key], nextState[key])) {
        return true;
      }
    }
    return false;
  }
  componentDidUpdate(prevProps) {
    if (this.props.currentTab !== prevProps.currentTab) {
      this.getData();
    }
    return true;
  }
  getData() {
    const currentTab = this.props.currentTab;

    if (currentTab === 0) {
      this.getCourse();
    } else if (currentTab === 1) {
      this.getSpace();
    }

    if (!sessionStorage.getItem(WebConstants.TOKEN)) {
      return;
    }
  }
  async getCourse() {
    let response = await axios
      .get("/RetrieveEventByEventIdServlet", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    if (response) {
      document.title = response.data.get("title");
      this.setState(() => ({
        course: response.data
      }));
    }

    // axios
    //   .get("/RetrieveEventParticipantsServlet", {
    //     params: {
    //       event_id: this.props.match.params.id,
    //       [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
    //     },
    //     validateStatus: function(status) {
    //       return +status === 200;
    //     }
    //   })
    //   .then(response => {
    //     console.log(response);
    //     if (response.data.already_joined_event) {
    //       this.setState(() => ({
    //         already_joined_event: true
    //       }));
    //     }
    //   })
    //   .catch(function(error) {
    //     if (!error.response) {
    //       sessionStorage.removeItem(WebConstants.TOKEN);
    //     }
    //   });
  }
  async getSpace() {
    let response = await axios
      .get("/space", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
    if (response) {
      document.title = response.data.get("title");
      this.setState(() => ({
        space: response.data
      }));
    }
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
  toShare = () => {
    this.setState({
      pickerVisible: true
    });
  };
  preview(size, file, e) {
    if (size > 5) {
      alert("", "当前为非Wi-Fi网络，是否继续查看全球通史.pdf(3.4MB)", [
        { text: "取消", onPress: () => console.log("cancel") },
        { text: "继续下载", onPress: () => (document.location.href = file) }
      ]);
    }
  }

  render() {
    console.log("render");
    const course = this.state.course;
    const tabs = [{ title: "活动详情" }, { title: <Badge>共享空间</Badge> }];

    let lessons = [];
    (this.state.space.get("lessons") || []).forEach(lesson => {
      lessons.push({
        value: lesson.get("name"),
        label: lesson.get("name")
      });
    });
    const courseID = +this.props.match.params.id;
    const currentTab = this.props.currentTab;
    return (
      <div key={courseID} id="course">
        <Tabs
          tabs={tabs}
          initialPage={currentTab}
          page={currentTab}
          onChange={(tab, index) => {
            this.props.onTabChange(courseID, index);
          }}
          swipeable={false}
        >
          <div>
            {course.get("title") && (
              <div>
                <div className="coverContainer">
                  <div
                    style={{
                      backgroundImage:
                        "url(https://www.jieshu.mobi:8181" +
                        course.get("event_frontcover_filepath") +
                        ")"
                    }}
                    className="blurCover"
                  />
                  <img
                    className="cover"
                    src={
                      "https://www.jieshu.mobi:8181" +
                      course.get("event_frontcover_filepath")
                    }
                    alt=""
                  />
                </div>

                <div className="info">
                  <div className="title">
                    <span className="name">{course.get("title")}</span>
                  </div>
                  <div className="deadline">
                    报名截止至：{Moment(
                      course.get("event_register_deadline")
                    ).format("YYYY/MM/DD")}
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
                        course.get("enrolled_already") +
                        "人/限制" +
                        course.get("max_attendence") +
                        "人"
                      }
                    >
                      报名人数
                    </Item>
                    <Item
                      extra={
                        Moment(course.get("event_start_date")).format(
                          "YYYY/MM/DD"
                        ) +
                        " ~ " +
                        Moment(course.get("event_end_date")).format(
                          "YYYY/MM/DD"
                        )
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
                            {course.get("address")}
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
                      __html: course.get("event_main_content")
                        ? this.generateNewLine(course.get("event_main_content"))
                        : "活动详情"
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              backgroundColor: "#fff",
              height: "300px"
            }}
          >
            <Accordion
              defaultActiveKey="0"
              className="my-accordion"
              onChange={this.onChange}
              style={{ width: "100%", marginTop: 10 }}
            >
              {this.state.space.get("lessons") &&
                this.state.space.get("lessons").map(lesson => (
                  <Accordion.Panel
                    key={lesson.get("name")}
                    header={lesson.get("name")}
                  >
                    <List className="my-list">
                      {lesson.get("files").map(file => (
                        <List.Item
                          key={file.get("name")}
                          onClick={this.preview.bind(this, 12, file.get("url"))}
                        >
                          {file.get("name")}
                        </List.Item>
                      ))}
                    </List>
                  </Accordion.Panel>
                ))}
            </Accordion>
          </div>
        </Tabs>
        <WhiteSpace />

        {currentTab === 0 &&
          new Date().getTime() < course.event_register_deadline &&
          (this.state.already_joined_event ? (
            <Button disabled className="enrollBtn" type="primary" size="large">
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
        {currentTab === 1 && (
          <Button
            className="enrollBtn"
            type="primary"
            size="large"
            onClick={this.toShare}
          >
            我要共享
          </Button>
        )}
        <BottomPickerView
          data={lessons}
          title="选择所属课程"
          value={["第一课 古希腊绘画艺术"]}
          onOk={e => {
            this.setState({
              pickerVisible: false
            });
            document.getElementById("uploader").click();
          }}
          onDismiss={() =>
            this.setState({
              pickerVisible: false
            })
          }
          visible={this.state.pickerVisible}
        />

        <input
          id="uploader"
          type="file"
          style={{ width: 0, height: 0, display: "none" }}
        />
      </div>
    );
  }
}
