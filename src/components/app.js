import React, { Component } from 'react';
import axios from 'axios';
import CourseList from './course_list';
import CourseSearch from './course_search';
import generateTimetables from '../utilities/timetable_generator';
import parseData from '../utilities/parser';
import TimetableViewer from './timetable_viewer';

const ROOT_URL = "http://localhost:4000";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { courseNames: [], courseData: [] };
    this.onAddCourse = this.onAddCourse.bind(this);
    this.onRemoveCourse = this.onRemoveCourse.bind(this);
  }

  render() {
    return (
      <div>
        <CourseSearch onAddCourse={this.onAddCourse}/>
        <CourseList
          courseNames={this.state.courseNames}
          onRemoveCourse={this.onRemoveCourse}/>
        <TimetableViewer timetables={generateTimetables(this.state.courseData)} />
        {/* pass a set of timetables with alternatives */}
      </div>
    );
  }

  onAddCourse(courseName) {
    this.setState({ courseNames: [...this.state.courseNames, courseName] });
    axios.get(`${ROOT_URL}/${courseName}`).then((response) => {
         let parsedData = parseData(response.data);
         this.setState( { courseData: [...this.state.courseData, parsedData]});
    });
  }

  onRemoveCourse(courseName) {
    this.setState(
      { courseNames:
        this.state.courseNames.filter((name) => name !== courseName)}
    );
  }

}

export default App;

