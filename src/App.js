import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home/Home";
import Profile from "./profile/Profile";
// import classNames from "classnames/bind";
import Course from "./course/Course";
import TabBar from "./components/tabbar/TabBar";
import EntryForm from "./entryform/EntryForm";
import "./App.less";
import SignIn from "./signin/SignIn";
import SignUp from "./signup/SignUp";
import MyCourses from "./mycourses/MyCourses";
import About from "./about/About";
import Invitation from "./invitation/Invitation";
import Settings from "./settings/Settings";
import ScrollToTop from "./components/ScrollToTop";
import OAMap from "./map/Map";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      tabMap: new Map([[1, 1]]),
      currentCourse: 0
    };
    this.onChange = this.onChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onCourseInit = this.onCourseInit.bind(this);
  }
  onChange(type) {
    this.setState({
      type: type
    });
  }
  onTabChange(courseID, currentTab) {
    this.setState(prevState => {
      return Object.assign(prevState, {
        tabMap: prevState.tabMap.set(courseID, currentTab)
      });
    });
  }
  onCourseInit(id) {
    this.setState({
      currentCourse: id
    });
  }
  render() {
    return (
      <Router>
        <ScrollToTop>
          <div>
            <Route
              exact
              path="/"
              render={() => (
                <Home type={this.state.type} onChange={this.onChange} />
              )}
            />
            <Route path="/profile" component={Profile} />
            <Route
              exact
              path="/course/:id"
              render={props => (
                <Course
                  {...props}
                  currentTab={
                    this.state.tabMap.get(this.state.currentCourse) || 0
                  }
                  onTabChange={this.onTabChange}
                  onCourseInit={this.onCourseInit}
                />
              )}
            />
            <Route exact path="/course/:id/entryForm" component={EntryForm} />
            <Route exact path="/course/:id/map" component={OAMap} />
            <Route exact path="/" component={TabBar} />
            <Route path="/profile" component={TabBar} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/me/courses" component={MyCourses} />
            <Route path="/about" component={About} />
            <Route path="/invitation" component={Invitation} />
            <Route path="/settings" component={Settings} />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
