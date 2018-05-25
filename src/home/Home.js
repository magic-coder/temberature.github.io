/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from "react";
import { Carousel } from "antd-mobile";
import ListView from "../components/listview/ListView";
import axios from "../utils/customAxios";
import "./Home.less";
import classNames from "classnames/bind";
import { List, is } from "immutable";
import CourseCard from '../components/CourseCard';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: List(),
      isLoading: false,
      fixedTop: 0,
      fixed: false
    };
    this.filter = this.filter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.header = this.header.bind(this);
  }
  componentDidMount() {
    document.title = "新生学院";
    this.filter();
  }
  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.filter();
    }
    return true;
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
  filter() {
    if (this.state.fixed) {
      window.scrollTo(0, this.state.fixedTop);
    }
    this.setState({
      isLoading: true,
      dataSource: List()
    });
    this.getCourses();
  }
  async getCourses() {
    let type = ["", "哲学", "艺术", "历史", "文学", "科技"][this.props.type];
    let response = await axios.get("/RetrieveEventServlet", {
      params: {
        event_tag: encodeURIComponent(type)
      }
    });

    this.setState({
      isLoading: false,
      dataSource: response.data.sort((a, b) => {
        return b.get("event_end_date") - a.get("event_end_date");
      })
    });
  }
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
  onFix = fixed => {
    this.setState({
      fixed: fixed
    });
  };
  onChange(type) {
    this.props.onChange(type);
  }

  header() {
    return (
      <header className="tabs">
        <span
          className={classNames({ active: this.props.type === 0 })}
          onClick={this.onChange.bind(this, 0)}
        >
          全部<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.props.type === 1 })}
          onClick={this.onChange.bind(this, 1)}
        >
          哲学<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.props.type === 2 })}
          onClick={this.onChange.bind(this, 2)}
        >
          艺术<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.props.type === 3 })}
          onClick={this.onChange.bind(this, 3)}
        >
          历史<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.props.type === 4 })}
          onClick={this.onChange.bind(this, 4)}
        >
          文学<span className="mark" />
        </span>
        <span
          className={classNames({ active: this.props.type === 5 })}
          onClick={this.onChange.bind(this, 5)}
        >
          科技<span className="mark" />
        </span>
      </header>
    );
  }
  separator(course) {
    return (
      <div
        key={course.get("course_id") * 2}
        style={{
          backgroundColor: "#E5E5E5",
          width: 335,
          height: 1,
          margin: "0 auto",
          border: 0
        }}
      />
    );
  }
  footer = () => {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        {this.state.isLoading ? "加载中..." : "你来到了宇宙的边界"}
      </div>
    );
  };
  render() {
    // console.log("render");
    return (
      <div id="home">
        <Carousel
          autoplay={false}
          infinite
          selectedIndex={0}
          style={{ height: 136 }}
        >
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
          renderRow={CourseCard}
          renderHeader={this.header}
          renderSeparator={this.separator}
          renderFooter={this.footer}
          onMore={this.loadMore}
          onFix={this.onFix}
          willFix={true}
          onInit={fixedTop => {
            this.setState({
              fixedTop: fixedTop
            });
          }}
        />
      </div>
    );
  }
}

export default Home;
