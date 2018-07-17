import React, { Component } from 'react';

import CheckList from'./check_list';

import generateTimetables from '../utilities/timetable_generator_beta';
import CourseManger from '../utilities/course_manager';
import parseData from '../utilities/parser';
import { CPSC_110_2018W, CPSC_121_2018W } from '../utilities/data'

import TimetableViewer from './timetable_viewer';

const ROOT_URL = "http://localhost:4000";

let courses = [
  { name: "CPSC 110", sectionsData: CPSC_110_2018W}, 
  { name: "CPSC 121", sectionsData: CPSC_121_2018W}
]

class App extends Component {

  constructor(props) {
    super(props);
    this.courseManager = new CourseManger();

    for (let course of courses) {
      this.courseManager.addCourse(parseData(course.name, course.sectionsData));
    }

    this.state = { courseNames: [], 
      checkList: this.courseManager.getAllCategories().map((category) => {
        return {value: category, checked: false}
      }) };
    this.onCheckStateChange = this.onCheckStateChange.bind(this);
    this.numberOfTimetableUpdates = 0;
  }

  render() {
    let categoriesToMergeWith = this.state.checkList.filter((element) => {
      return element.checked;
    }).map(({value}) => value);
    let timetables = generateTimetables(this.courseManager, categoriesToMergeWith);
    let isViewingTimetablesWithOptions = false;
    if (timetables.length > 0) {
      isViewingTimetablesWithOptions = (timetables[0].constructor.name === "TimetableWithOptions");
    }
    return (
      <div>
        <h1> TimetableViewer </h1>
        <TimetableViewer
          timetables={timetables}
          id={this.numberOfTimetableUpdates}
          isViewingTimetablesWithOptions={isViewingTimetablesWithOptions}
        />
        <CheckList
          list={this.state.checkList} 
          onChange={this.onCheckStateChange}
        />
      </div>
    );
  }

  onCheckStateChange(category) {
    this.numberOfTimetableUpdates++;
    this.setState((prevState) => {
      let copy = prevState.checkList.slice();
      for (let element of copy) {
        if (element.value === category) {
          element.checked = !element.checked;
        }
      }
      return copy;
    });
  }

}

export default App;

