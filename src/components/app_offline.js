import React, { Component } from 'react';

import CategoryList from './category_list';

import generateTimetables from '../utilities/timetable_generator';
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

    this.state = { courseNames: [] };
  }

  render() {
    return (
      <div>
        <TimetableViewer timetables={generateTimetables(this.courseManager)}/>
        <CategoryList sectionNames={this.courseManager.getAllCategories()}/>
      </div>
    );
  }
}

export default App;

