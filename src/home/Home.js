/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from "react";
import { Carousel } from "antd-mobile";
import ListView from "../components/listview/ListView";
import axios from "../utils/customAxios";
import "./Home.less";
import { Link } from "react-router-dom";
import Moment from "moment";
import Period from "../components/period/Period";
import classNames from "classnames/bind";

class Home extends React.Component {
  constructor(props) {
    super(props);
    // var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: [],
      type: 0,
      isLoading: false,
      fixedTop: 0,
      fixed: false
    };
    this.filter = this.filter.bind(this);
  }
  componentDidMount() {
    document.title = "新生学院";
    this.filter(this.props.type);
  }
  row(course) {
    return (
      <Link
        to={"/course/" + course.get('course_id')}
        key={course.get('course_id')}
        className="course"
      >
        <img
          className="cover"
          src={
            "https://www.jieshu.mobi:8181" + course.get('event_frontcover_filepath')
          }
          alt=""
        />
        <div className="info">
          <div className="name">{course.get('title')}</div>
          <div className="time">
            <label htmlFor="">时间：</label>
            {Moment(course.get('event_start_date')).format("YYYY/MM/DD")} ～{" "}
            {Moment(course.get('event_end_date')).format("YYYY/MM/DD")}
          </div>
          <div className="address">
            <label htmlFor="">地点：</label>
            {course.get('address')}
          </div>
          <div className="quota">
            <label htmlFor="">人数：</label>
            限{course.get('max_attendence')}人
          </div>
          <div className="period">
            <Period
              course={course}
              images={[
                require("./assets/period_enrolling.png"),
                require("./assets/period_ongoing.png"),
                require("./assets/period_finish.png")
              ]}
            />
          </div>
        </div>
      </Link>
    );
  }
  header() {
    return (
      <header className="tabs">
        <span
          className={classNames({ active: this.state.type === 0 })}
          onClick={this.filter.bind(this, 0)}
        >
          全部<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.state.type === 1 })}
          onClick={this.filter.bind(this, 1)}
        >
          哲学<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.state.type === 2 })}
          onClick={this.filter.bind(this, 2)}
        >
          艺术<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.state.type === 3 })}
          onClick={this.filter.bind(this, 3)}
        >
          历史<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.state.type === 4 })}
          onClick={this.filter.bind(this, 4)}
        >
          文学<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.state.type === 5 })}
          onClick={this.filter.bind(this, 5)}
        >
          科技<span className="mark" />
        </span>
      </header>
    );
  }
  filter(type) {
    if (this.state.fixed) {
      window.scrollTo(0, this.state.fixedTop);
    }
    this.setState({
      type,
      isLoading: true,
      dataSource: [],
    });
    this.props.onChange(type);
    type = ["", "哲学", "艺术", "历史", "文学", "科技"][type];
    axios
      .get("/RetrieveEventServlet", {
        params: {
          event_tag: encodeURIComponent(type)
        }
      })
      .then(response => {
        this.setState({
          isLoading: false,
          dataSource: response.data.sort((a, b) => {
            return a.event_end_date < b.event_end_date;
          }),

        });

      });
  };
  separator = () => {
    return (
      <div
        style={{
          backgroundColor: "#E5E5E5",
          width: 335,
          height: 1,
          margin: "0 auto",
          border: 0
        }}
      />
    );
  };
  footer = () => {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        {this.state.isLoading ? "加载中..." : "你来到了宇宙的边界"}
      </div>
    );
  };
  loadMore = () => {
    // this.setState({ isLoading: true });
    return axios.get("/RetrieveEventServlet").then(response => {
      return;
      // this.setState({ isLoading: false });
      // this.setState(prev => {
      //   return {
      //     dataSource: prev.dataSource.concat(
      //       response.data.sort((a, b) => {
      //         return a.event_end_date < b.event_end_date;
      //       })
      //     )
      //   };
      // });
    });
  };
  onFix = (fixed) => {
    this.setState({
      fixed: fixed
    })
  }
  render() {
    console.log('render');
    return (
      <div id="home">
        <Carousel autoplay={false} infinite selectedIndex={0} style={{height: 136}}>
          {["banner1.png", "banner2.jpg", "banner3.jpg"].map(val => (
            <a key={val} href="/">
              <img
                src={`http://www.boluomi.org/assets/images/${val}`}
                alt=""
                style={{ width: "100%", verticalAlign: "top" }}
              />
            </a>
          ))}
        </Carousel>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={course => this.row(course)}
          renderHeader={() => this.header()}
          renderSeparator={() => this.separator()}
          renderFooter={() => this.footer()}
          useBodyScroll
          loadMore={this.loadMore}
          onFix={this.onFix}
          fixed={this.state.fixed}
          onInit={(fixedTop) => {
            console.log(fixedTop);
            this.setState({
              fixedTop: fixedTop
            })
          }}
        />
      </div>
    );
  }
}

export default Home;
