import React from "react";
import renderer from "react-test-renderer";
import Vericode from "./Vericode";

it("renders correctly", function() {
  const tree = renderer
    .create(
      <Vericode />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
