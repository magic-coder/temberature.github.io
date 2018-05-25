import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TabBar from "./TabBar";

it("renders correctly", function() {
  const tree = renderer
    .create(
      <Router>
        <Route>
          <TabBar
            titles={["新生学院", "个人中心"]}
            icons={["./assets/icon_home.svg", "./assets/icon_profile.svg"]}
          />
        </Route>
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
