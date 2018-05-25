import React from "react";

export default class Period extends React.Component {
  render() {
    const { course, images } = this.props;
    if (!course || !images) {
      return null;
    }

    const now = Date.now();
    const deadline = course.get
        ? course.get("event_register_deadline")
        : course.event_register_deadline,
      start = course.get
        ? course.get("event_start_date")
        : course.event_start_date,
      end = course.get ? course.get("event_end_date") : course.event_end_date;
    const valid = deadline <= end && start <= end;
    if (!valid) {
      return <img src="" alt="" />;
    }
    let img = "";
    if (now < deadline) {
      img = images[0];
    } else if (now >= start && now <= end) {
      img = images[1];
    } else if (now > end) {
      img = images[2];
    }
    return <img src={img} style={{ verticalAlign: "bottom" }} alt="" />;
  }
}
