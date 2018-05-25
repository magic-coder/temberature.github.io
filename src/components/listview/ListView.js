import React from "react";
import "./ListView.less";
import ReactDOM from "react-dom";

class ListView extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [1, 2, 3],
      fixed: false,
      top: null,
      locked: false
    };
    this.loadMore = this.loadMore.bind(this);
    this.fixTest = this.fixTest.bind(this);
    this.handleScroll();

  }
  componentDidMount() {
    const container = ReactDOM.findDOMNode(this.refs.container);
    this.props.onInit && this.props.onInit(container && container.getBoundingClientRect().top);
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadMore);
    document.removeEventListener("scroll", this.fixTest);
  }
  handleScroll = () => {
    document.addEventListener("scroll", this.loadMore);
    document.addEventListener("scroll", this.fixTest);
  };
  fixTest() {
    const container = ReactDOM.findDOMNode(this.refs.container);
    let topTest = this.topTest(container);
    if (topTest.hitTop) {
      this.props.onFix(true);
    } else if (topTest.leaveTop) {
      this.props.onFix(false);
    }
  }
  loadMore() {
    if (this.state.locked) {
      return;
    }
    const container = ReactDOM.findDOMNode(this.refs.container);
    var leave = this.leaveBottomTest(container);
    // console.log(leave);
    if (leave) {
      this.setState({
        locked: true
      });
      this.props.loadMore().then(() => {
        this.setState({
          locked: false
        });
      });
      // this.setState(prev => {
      //   var is = prev.items,
      //     l = is.length;
      //   for (var i = 0; i < l; i++) {
      //     this.state.items[l + i] = is[i] + l;
      //     console.log(this.state.items);
      //   }

      // });
    }
  }
  leaveBottomTest(elem) {
    var screenHeight = window.innerHeight;
    return elem && elem.getBoundingClientRect().bottom <= screenHeight;
  }
  topTest(elem) {
    const top = elem && elem.getBoundingClientRect().top;
    // console.log(top);

    let r = {
      hitTop: false,
      leaveTop: false
    };

    if (this.state.top > 0 && top <= 0) {
      r.hitTop = true;
    }
    if (this.state.top <= 0 && top > 0) {
      r.leaveTop = true;
    }
    this.setState({
      top: top
    });
    return r;
  }
  render() {
    return (
      <div className="am-list-view-scrollview" ref="container">
        <div
          className="am-list-header"
          style={{ position: this.props.fixed && "fixed", top: 0 }}
        >
          {this.props.renderHeader()}
        </div>
        <div className="list-view-section-body">
          {this.props.dataSource.map(val => {
            return [this.props.renderRow(val), this.props.renderSeparator(val)];
          })}
        </div>
        <div className="am-list-footer">{this.props.renderFooter()}</div>
      </div>
    );
  }
}
export default ListView;
