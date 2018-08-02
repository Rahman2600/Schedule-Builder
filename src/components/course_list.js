import React from "react";

//button -> accordion -> checkstate passed from in parent component updates timetable
function CourseList(props) {
  return (
    <ul className="list-group">
      {props.courseNames.map(courseName => {
        return (
          <li className="list-group-item d-flex" key={courseName}>
            <span> {courseName + " "} </span>
            <button
              type="button"
              onClick={() => props.onRemoveCourse(courseName)}
              className="ml-auto"
            >
              X
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default CourseList;
