import React from "react";
import "./ListView.less";
import ReactDOM from "react-dom";

class ListView extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [1, 2, 3]
    };
    this.handleScroll();
  }
  handleScroll = () => {
    var locked = false;
    document.addEventListener("scroll", () => {
      // console.log(this.refs);
      if (locked) {
        return;
      }
      var hit = this.hitBottomTest(ReactDOM.findDOMNode(this.refs.container));
      // console.log(hit);
      if (hit) {
        locked = true;
        this.props.loadMore().then(() => {
          locked = false;
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
    });
  };
  hitBottomTest(elem) {
    var screenHeight = window.innerHeight;
    return elem && elem.getBoundingClientRect().bottom <= screenHeight;
  }
  render() {
    return (
      <div className="am-list-view-scrollview" ref="container">
        <div className="am-list-header">{this.props.renderHeader()}</div>
        <div className="list-view-section-body">
          {this.props.dataSource.map(val => {
            return [this.props.renderRow(val), this.props.renderSeparator()];
          })}
        </div>
        <div className="am-list-footer">{this.props.renderFooter()}</div>
      </div>
    );
  }
}
export default ListView;
