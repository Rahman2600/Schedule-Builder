import React from 'react';

function CourseList(props) {
  return (
    <ul>
      {props.courseNames.map((courseName) => {
        return <li key={courseName}>
                  {courseName + " "}
                  <button
                    type="button"
                    onClick={() => props.onRemoveCourse(courseName)}
                    >X</button>
                </li>
      })}
    </ul>
  );
}

export default CourseList;
