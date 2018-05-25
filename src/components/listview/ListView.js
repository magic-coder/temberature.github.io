import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Immutable from "immutable";

import "./ListView.less";

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
      fixed: false
    };
    this.loadMoreTest = this.loadMoreTest.bind(this);
    this.fixTest = this.fixTest.bind(this);
  }
  UNSAFE_componentWillMount() {
    if (this.props.onFix && !this.props.willFix) {
      throw new Error("onFix will not fire when willFix is false");
    }
    this.handleScroll();
  }
  componentDidMount() {
    const container = ReactDOM.findDOMNode(this.refs.container);
    this.props.onInit &&
      this.props.onInit(container && container.getBoundingClientRect().top);
  }
  componentWillUnmount() {
    this.props.onMore && document.removeEventListener("scroll", this.loadMoreTest);
    this.props.willFix && document.removeEventListener("scroll", this.fixTest);
  }
  handleScroll = () => {
    this.props.onMore && document.addEventListener("scroll", this.loadMoreTest);

    this.props.willFix && document.addEventListener("scroll", this.fixTest);
  };
  fixTest() {
    const container = ReactDOM.findDOMNode(this.refs.container);
    let topTest = this.topTest(container);
    if (topTest.hitTop) {
      this.setState({
        fixed: true
      });
      this.props.onFix && this.props.onFix(true);
    } else if (topTest.leaveTop) {
      this.setState({
        fixed: false
      });
      this.props.onFix && this.props.onFix(false);
    }
  }
  loadMoreTest() {
    if (this.state.locked) {
      return;
    }
    const container = ReactDOM.findDOMNode(this.refs.container);
    var leave = this.leaveBottomTest(container);
    if (leave) {
      this.setState({
        locked: true
      });
      let more = this.props.onMore();

      if (!(more instanceof Promise)) {
        throw new Error('onMore returnType should be Promise')
      } else {
        more.then(() => {
          this.setState({
            locked: false
          });
        });
      }

    }
  }
  leaveBottomTest(elem) {
    var screenHeight = window.innerHeight;
    return elem && elem.getBoundingClientRect().bottom <= screenHeight;
  }
  topTest(elem) {
    const top = elem && elem.getBoundingClientRect().top;
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
      <div className="oa-list-view-scrollview" ref="container">
        <div
          className="oa-list-header"
          style={{ position: this.state.fixed ? "fixed" : "", top: 0 }}
        >
          {this.props.renderHeader && this.props.renderHeader()}
        </div>
        <div className="oa-list-view-section-body">
          {this.props.dataSource.map(val => {
            return [
              this.props.renderRow(val),
              this.props.renderSeparator && this.props.renderSeparator(val)
            ];
          })}
        </div>
        <div className="oa-list-footer">
          {this.props.renderFooter && this.props.renderFooter()}
        </div>
      </div>
    );
  }
}

ListView.propTypes = {
  dataSource: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.instanceOf(Immutable.List)
  ]).isRequired,
  renderRow: PropTypes.func.isRequired,
  renderHeader: PropTypes.func,
  renderFooter: PropTypes.func,
  renderSeparator: PropTypes.func,
  willFix: PropTypes.bool,
  onFix: PropTypes.func,
  onMore: PropTypes.func
};
export default ListView;
