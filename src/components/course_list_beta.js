import React from "react";

function CourseList(props) {
  let filter = props.filter;
  let coursesFilter = filter.getCoursesFilter();

  return (
    <ul className="list-group pl-2">
      {coursesFilter.map(({ courseName, included }) => {
        return (
          <div key={courseName}>
            <div className="mb-2" style={{ "font-size": "1.2em" }}>
              <input
                type="checkbox"
                className="mr-2"
                checked={included}
                onChange={() => props.onCoursesSelectedChange(courseName)}
              />
              <a
                style={{ color: "buttontext" }}
                data-toggle="collapse"
                href={`#${removeWhitespace(courseName)}`}
              >
                <i class="fas fa-chevron-down" />
              </a>
              <span> {courseName} </span>
            </div>
            <div
              id={removeWhitespace(courseName)}
              className="collapse"
              style={{ "padding-left": 15 }}
            >
              {filter
                .getActivitiesFilterOfCourse(courseName)
                .map(({ activity, included, inTimetableView }) => {
                  return (
                    <div>
                      <div className="mb-2">
                        <input
                          type="checkbox"
                          className="mr-1"
                          checked={included}
                          onChange={() =>
                            props.onActivitiesOfCoursesSelectedChange({
                              courseName,
                              activity
                            })
                          }
                        />
                        <a
                          style={{ color: "buttontext" }}
                          data-toggle="collapse"
                          href={`#${removeWhitespace(courseName) + activity}`}
                        >
                          <i class="fas fa-chevron-down" />
                        </a>
                        <span> {`${activity} sections`} </span>
                      </div>
                      <div
                        className="list-group collapse"
                        style={{ "padding-left": 17 }}
                        id={removeWhitespace(courseName) + activity}
                      >
                        {filter
                          .getSectionsFilterOfActivitiesOfCourse({
                            courseName,
                            activity
                          })
                          .map(({ sectionName, included }) => {
                            return (
                              <div className="mb-1">
                                <input
                                  type="checkbox"
                                  checked={included}
                                  onChange={() =>
                                    props.onSectionsOfActivitiesOfCoursesSelectedChange(
                                      { courseName, activity, sectionName }
                                    )
                                  }
                                />
                                <span> {sectionName} </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </ul>
  );
}

function removeWhitespace(str) {
  return str.replace(/ /g, "");
}

export default CourseList;
