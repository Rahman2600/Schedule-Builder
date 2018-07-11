import React, { Component } from 'react';
import CourseList from './course_list';
import CourseSearch from './course_search';
import generateTimetables from '../utilities/timetable_generator';
import parseData from '../utilities/parser';
import { CPSC_110_2018W, CPSC_121_2018W } from '../utilities/data'
import TimetableViewer from './timetable_viewer';

const ROOT_URL = "http://localhost:4000";

let STATIC_DATA = [ CPSC_110_2018W, CPSC_121_2018W ];

class App extends Component {


  constructor(props) {
    super(props);
    let parsedData = STATIC_DATA.map((data) => parseData(data));
    this.state = { courseNames: [], courseData: parsedData };
  }

  render() {
    return (
      <div>
        <CourseSearch onAddCourse={this.onAddCourse} />
        <CourseList
          courseNames={this.state.courseNames}
          onRemoveCourse={this.onRemoveCourse} />
        <TimetableViewer timetables={generateTimetables(this.state.courseData)} />
        {/* pass a set of timetables with alternatives */}
      </div>
    );
  }
}

export default App;

