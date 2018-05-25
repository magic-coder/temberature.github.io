// import { configure } from "enzyme";
// import Adapter from "enzyme-adapter-react-15";
// configure({ adapter: new Adapter() });
import React from "react";
// import ReactDOM from "react-dom";
import Period from "./Period";
// import { shallow, mount, render } from "enzyme";
import renderer from "react-test-renderer";

const now = Date.now();
const weekTime = 7 * 24 * 60 * 60;

it("valid data", () => {
  const cases = new Map([
    [
      "enrolling",
      {
        event_register_deadline: now + weekTime,
        event_start_date: now + 2 * weekTime,
        event_end_date: now + 3 * weekTime,
      }
    ],
    [
      "ongoing",
      {
        event_register_deadline: now - 2 * weekTime,
        event_start_date: now - weekTime,
        event_end_date: now + weekTime,
      }
    ],
    [
      "finish",
      {
        event_register_deadline: now - 3 * weekTime,
        event_start_date: now - 2 * weekTime,
        event_end_date: now - weekTime,
      }
    ]
  ]);


  cases.forEach((value, key) => {
    const tree = renderer
    .create(
      <Period
        course={value}
        images={[
          "period_enrolling.png",
          "period_ongoing.png",
          "period_finish.png"
        ]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
  });
});

it("invalid data", () => {
  const cases = new Map([
    [
      "invalid",
      {
        event_register_deadline: now + 3 * weekTime,
        event_start_date: now - weekTime,
        event_end_date: now - 2 * weekTime,
      }
    ]
  ]);

  cases.forEach((value, key) => {
    const tree = renderer
    .create(
      <Period
        course={value}
        images={[
          "period_enrolling.png",
          "period_ongoing.png",
          "period_finish.png"
        ]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
  });
});
