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
  handleScroll() {
    var locked = false, batch = this.state.items.length;
    document.addEventListener("scroll", () => {
      console.log(this.refs);
      if (locked) {
        return;
      }
      var hit = this.hitBottomTest(ReactDOM.findDOMNode(this.refs.container));
      console.log(hit);
      if (hit) {
        locked = true;
        this.setState(prev => {
          var is = prev.items,
            l = is.length;
          for (var i = 0; i < batch; i++) {
            this.state.items[l + i] = is[i] + l;
            console.log(this.state.items);
          }
          locked = false;
        });
      }
    });
  }
  hitBottomTest(elem) {
    var screenHeight = window.innerHeight;
    var scrollTop = document.scrollTop;
    // return elementBottom - screenHeight - scrollTop >= 0;
    return elem.getBoundingClientRect().bottom <= screenHeight;
  }
  render() {
    return (
      <div className="listview" ref="container">
        {this.state.items.map(val => (
          <div className="row" key={val}>
            {val}
          </div>
        ))}
      </div>
    );
  }
}
export default ListView;
