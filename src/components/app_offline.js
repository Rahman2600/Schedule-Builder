import React, { Component } from "react";

import CourseList from "./course_list_beta";
import CourseSearch from "./course_search";
// import { getUpdatedStateOnSelectChange } from "../state/check_list_state";

import generateTimetables from "../utilities/timetable_generator";
import CourseManger from "../utilities/course_manager";
import parseData from "../utilities/parser";
import FilterViewState from "../utilities/filter_view_state";
import { CPSC_110_2018W, CPSC_121_2018W } from "../utilities/data";

import TimetableViewer from "./timetable_viewer";

let courses = [
  { name: "CPSC 110", sectionsData: CPSC_110_2018W },
  { name: "CPSC 121", sectionsData: CPSC_121_2018W }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.courseManager = new CourseManger();

    for (let course of courses) {
      this.courseManager.addCourse(parseData(course.name, course.sectionsData));
    }

    this.state = {
      courseNames: [],
      filterViewState: new FilterViewState(this.courseManager)
    };

    this.numberOfTimetableUpdates = 0;
    // this.onSelectedCategoriesChange = this.onSelectedCategoriesChange.bind(
    //   this
    // );
    this.onCoursesSelectedChange = this.onCoursesSelectedChange.bind(this);
    this.onActivitiesOfCoursesSelectedChange = this.onActivitiesOfCoursesSelectedChange.bind(
      this
    );
    this.onSectionsOfActivitiesOfCoursesSelectedChange = this.onSectionsOfActivitiesOfCoursesSelectedChange.bind(
      this
    );
    this.onViewOfActivityChange = this.onViewOfActivityChange.bind(this);
  }

  render() {
    // let categoriesToMergeWith = this.state.categorySelectionState
    //   .filter(element => {
    //     return element.checked;
    //   })
    //   .map(({ value }) => value);

    let timetables = generateTimetables(
      this.courseManager,
      this.state.filterViewState
    );
    let isViewingTimetablesWithOptions = false;
    if (timetables.length > 0) {
      isViewingTimetablesWithOptions =
        timetables[0].constructor.name === "TimetableWithOptions";
    }
    return (
      <div className="container-fluid">
        <h1 className="text-center py-3"> ScheduleBuilder </h1>
        <div className="row">
          <div className="col-md-3">
            <CourseSearch onAddCourse={this.onAddCourse} />
            <CourseList
              courseManager={this.courseManager}
              onRemoveCourse={this.onRemoveCourse}
              filter={this.state.filterViewState}
              onCoursesSelectedChange={this.onCoursesSelectedChange}
              onActivitiesOfCoursesSelectedChange={
                this.onActivitiesOfCoursesSelectedChange
              }
              onSectionsOfActivitiesOfCoursesSelectedChange={
                this.onSectionsOfActivitiesOfCoursesSelectedChange
              }
              onViewOfActivityChange={this.onViewOfActivityChange}
            />
            {/* {this.courseManager.hasCourses() ? (
              <div>
                <h6> Sections to pin </h6>
                <CheckList
                  list={this.state.categorySelectionState}
                  onChange={this.onSelectedCategoriesChange}
                />
              </div>
            ) : null} */}
          </div>
          <div className="col-md-9">
            <TimetableViewer
              timetables={timetables}
              id={this.numberOfTimetableUpdates}
              isViewingTimetablesWithOptions={isViewingTimetablesWithOptions}
            />
          </div>
        </div>
      </div>
    );
  }

  //fix coupling between use of checklist between this component and viewer
  // onSelectedCategoriesChange(category) {
  //   this.numberOfTimetableUpdates++;
  //   this.setState(prevState => {
  //     return {
  //       categorySelectionState: getUpdatedStateOnSelectChange(
  //         category,
  //         prevState.categorySelectionState
  //       )
  //     };
  //   });
  // }

  onCoursesSelectedChange(courseName) {
    this.numberOfTimetableUpdates++;
    this.setState(prevState => {
      return {
        filterViewState: prevState.filterViewState.toggleCourseInclusionState(
          courseName
        )
      };
    });
  }

  onActivitiesOfCoursesSelectedChange(changedField) {
    this.numberOfTimetableUpdates++;
    this.setState(prevState => {
      return {
        filterViewState: prevState.filterViewState.toggleActivityInclusionState(
          changedField
        )
      };
    });
  }

  onSectionsOfActivitiesOfCoursesSelectedChange(changedField) {
    this.numberOfTimetableUpdates++;
    this.setState(prevState => {
      return {
        filterViewState: prevState.filterViewState.toggleSectionInclusionState(
          changedField
        )
      };
    });
  }

  onViewOfActivityChange(changedField) {
    this.numberOfTimetableUpdates++;
    this.setState(prevState => {
      return {
        filterViewState: prevState.filterViewState.toggleActivityView(
          changedField
        )
      };
    });
  }
}

export default App;
