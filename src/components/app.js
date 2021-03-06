import React, { Component } from "react";
import axios from "axios";
import CourseList from "./course_list_beta";
import CourseSearch from "./course_search";
import generateTimetables from "../utilities/timetable_generator";
import TimetableViewer from "./timetable_viewer";
import CourseManger from "../utilities/course_manager";
import parseData from "../utilities/parser";
import CheckList from "./check_list";
import { getUpdatedStateOnSelectChange } from "../state/check_list_state";

const ROOT_URL = "http://localhost:4000";

class App extends Component {
  constructor(props) {
    super(props);
    this.courseManager = new CourseManger();
    this.onAddCourse = this.onAddCourse.bind(this);
    this.state = {
      courseNames: []
    };
    this.numberOfTimetableUpdates = 0;
    let filter = new Filter(this.courseManager);
    console.log(JSON.stringify(...filter));
    this.onRemoveCourse = this.onRemoveCourse.bind(this);
    this._getCategoriesToMergeWith = this._getCategoriesToMergeWith.bind(this);
    this.onSelectedCategoriesChange = this.onSelectedCategoriesChange.bind(
      this
    );
  }

  render() {
    let timetables = generateTimetables(
      this.courseManager,
      this._getCategoriesToMergeWith()
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
          <div className="col-md-2">
            <CourseSearch onAddCourse={this.onAddCourse} />
            <CourseList
              courseNames={this.state.courseNames}
              courseManager={this.courseManager}
              onRemoveCourse={this.onRemoveCourse}
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
          <div className="col-md-10">
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

  onAddCourse(courseName) {
    let copy = this.state.courseNames.slice();
    copy.push(courseName);
    this.setState({ courseNames: copy });
    axios.get(`${ROOT_URL}/${courseName}`).then(response => {
      let parsedData = parseData(courseName, response.data);
      this.courseManager.addCourse(parsedData);
      this.setState({
        categorySelectionState: this.courseManager
          .getAllCategories()
          .map(category => {
            return { value: category, checked: false };
          })
      });
    });
  }

  onRemoveCourse(courseName) {
    this.courseManager.removeCourse(courseName);
    let index = this.state.courseNames.indexOf(courseName);
    let copy = this.state.courseNames.slice();
    copy.splice(index, index + 1);
    this.setState({ courseNames: copy });
  }

  onSelectedCategoriesChange(category) {
    this.numberOfTimetableUpdates++;
    this.setState(prevState => {
      return {
        categorySelectionState: getUpdatedStateOnSelectChange(
          category,
          prevState.categorySelectionState
        )
      };
    });
  }

  _getCategoriesToMergeWith() {
    if (this.state && this.state.categorySelectionState) {
      return this.state.categorySelectionState
        .filter(element => {
          return element.checked;
        })
        .map(({ value }) => value);
    } else return [];
  }
}

export default App;
