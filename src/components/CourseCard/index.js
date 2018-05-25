import React from "react";
import { Link } from "react-router-dom";
import Moment from "moment";
import Period from "../period/Period";
import "./index.less";

function row(course) {
  return (
    <Link
      to={"/course/" + course.get("course_id")}
      key={course.get("course_id")}
      className="CourseCard"
    >
      <img
        className="cover"
        src={
          "https://www.jieshu.mobi:8181" +
          course.get("event_frontcover_filepath")
        }
        alt=""
      />
      <div className="info">
        <div className="name">{course.get("title")}</div>
        <div className="time">
          <label htmlFor="">时间：</label>
          {Moment(course.get("event_start_date")).format("YYYY/MM/DD")} ～{" "}
          {Moment(course.get("event_end_date")).format("YYYY/MM/DD")}
        </div>
        <div className="address">
          <label htmlFor="">地点：</label>
          {course.get("address")}
        </div>
        <div className="quota">
          <label htmlFor="">人数：</label>
          限{course.get("max_attendence")}人
        </div>
        <div className="period">
          <Period
            course={course}
            images={[
              require("./assets/period_enrolling.png"),
              require("./assets/period_ongoing.png"),
              require("./assets/period_finish.png")
            ]}
          />
        </div>
      </div>
    </Link>
  );
}

export default row;
