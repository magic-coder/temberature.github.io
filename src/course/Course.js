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

const Item = List.Item;
const alert = Modal.alert;

export default class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {},
      space: {},
      already_joined_event: false,
      currentTab: 0,
      pickerVisible: false
    };
  }

  componentDidMount() {
    this.getData();
  }
  componentWillReceiveProps() {
    this.getData();
  }
  getData() {
    document.title = "课程主页";

    const currentTab = this.props.tabMap.get(+this.props.match.params.id);

    if (currentTab === 0) {
      this.getCourse();
    } else if (currentTab === 1) {
      this.getSpace();
    }

    if (!sessionStorage.getItem(WebConstants.TOKEN)) {
      console.log(111);
      return;
    }
  }
  getCourse() {
    axios
      .get("/RetrieveEventByEventIdServlet", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
      .then(response => {
        console.log(response);
        document.title = response.data.title;
        this.setState(() => ({
          course: response.data
        }));
      })
      .catch(function(error) {
        console.log(error);
      });
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
  getSpace() {
    axios
      .get("/space", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
      .then(response => {
        console.log(response);
        document.title = response.data.title;
        this.setState(() => ({
          space: response.data
        }));
      })
      .catch(function(error) {
        console.log(error);
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
    const course = this.state.course;
    const tabs = [{ title: "活动详情" }, { title: <Badge>共享空间</Badge> }];

    const lessons = [
      {
        value: "第一课 古希腊绘画艺术",
        label: "第一课 古希腊绘画艺术"
      },
      {
        value: "第二课 罗马绘画及马赛克艺术",
        label: "第二课 罗马绘画及马赛克艺术"
      }
    ];
    const courseID = +this.props.match.params.id;
    const currentTab = this.props.tabMap.get(courseID);
    return (
      <div key={courseID} id="course">
        <Tabs
          tabs={tabs}
          initialPage={currentTab}
          onChange={(tab, index) => {
            console.log("onChange", index, tab);

            this.props.onTabChange(courseID, index);
          }}
          onTabClick={(tab, index) => {
            console.log("onTabClick", index, tab);
          }}
          swipeable={false}
          ref={this.setTabsRef}
        >
          <div
            style={
              {
                // display: "flex",
                // justifyContent: "center",
                // flexDirection: "column",
                // backgroundColor: "#fff"
              }
            }
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
              <Accordion.Panel header="第一课-史前">
                <List className="my-list">
                  <List.Item
                    onClick={this.preview.bind(
                      this,
                      12,
                      "http://123.56.222.135:8080/study/%E5%9F%BA%E4%BA%8ECreatejs%E7%9A%84%E8%BF%90%E8%90%A5%E6%B8%B8%E6%88%8F.pdf"
                    )}
                  >
                    加德纳艺术史.pdf
                  </List.Item>
                  <List.Item>古希腊古罗马艺术史课上讨论录音.ppt</List.Item>
                </List>
              </Accordion.Panel>
              <Accordion.Panel header="第二课-古希腊" className="pad">
                <List.Item>加德纳艺术史.doc</List.Item>
                <List.Item>加德纳艺术史.jpg</List.Item>
              </Accordion.Panel>
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
