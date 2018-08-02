import _ from "lodash";

class FilterViewState {
  constructor(courseManger) {
    this.filter = new Map();
    for (let course of courseManger.getCourses()) {
      this.filter.set(course.name, {
        included: true,
        subFilter: this._getCourseSubFilters(course)
      });
    }
  }

  _getCourseSubFilters(course) {
    let subFilter = new Map();
    for (let { activity, sections } of course.getSectionsGroupedByActivity()) {
      subFilter.set(activity, {
        included: true,
        inTimetableView: true,
        subFilter: this._getSectionFilters(sections)
      });
    }
    return subFilter;
  }

  _getSectionFilters(sections) {
    let filter = new Map();
    for (let section of sections) {
      filter.set(section.name, true);
    }
    return filter;
  }

  toggleSelectionState(field) {
    if (field.type === "course") {
      let state = this._getCourseFilter(field.courseName).included;
      state = !state;
    } else if (field.type === "course+activity") {
      let state = this._getCourseActivityFilter(field.courseActivity).included;
      state = !state;
    } else {
      let state = this._getSectionFilter(field.sectionName).included;
      state = !state;
    }
  }

  getCoursesFilter() {
    let coursesFilter = [];
    for (let [key, value] of this.filter) {
      coursesFilter.push({ courseName: key, included: value.included });
    }
    return coursesFilter;
  }

  getSelectedCourseNames() {
    return this.getCoursesFilter()
      .filter(({ included }) => included)
      .map(({ courseName }) => courseName);
  }

  getActivitiesFilterOfCourse(courseName) {
    let activitiesFilter = [];
    for (let [key, value] of this.filter.get(courseName).subFilter) {
      activitiesFilter.push({
        activity: key,
        included: value.included,
        inTimetableView: value.inTimetableView
      });
    }
    return activitiesFilter;
  }

  getSelectedActivitiesOfCourse(courseName) {
    return this.getActivitiesFilterOfCourse(courseName)
      .filter(({ included }) => included)
      .map(({ activity }) => activity);
  }

  getSectionsFilterOfActivitiesOfCourse({ courseName, activity }) {
    let sectionsFilter = [];
    for (let [key, value] of this.filter.get(courseName).subFilter.get(activity)
      .subFilter) {
      sectionsFilter.push({
        sectionName: key,
        included: value
      });
    }
    return sectionsFilter;
  }

  getSelectedSections(field) {
    return this.getSectionsFilterOfActivitiesOfCourse(field)
      .filter(({ included }) => included)
      .map(({ sectionName }) => sectionName);
  }

  toggleCourseInclusionState(courseName) {
    let copy = _.cloneDeep(this);
    copy.filter.get(courseName).included = !copy.filter.get(courseName)
      .included;
    return copy;
  }

  toggleActivityInclusionState({ courseName, activity }) {
    let copy = _.cloneDeep(this);
    copy.filter
      .get(courseName)
      .subFilter.get(activity).included = !copy.filter
      .get(courseName)
      .subFilter.get(activity).included;
    return copy;
  }

  toggleActivityView({ courseName, activity }) {
    let copy = _.cloneDeep(this);
    copy.filter
      .get(courseName)
      .subFilter.get(activity).inTimetableView = !copy.filter
      .get(courseName)
      .subFilter.get(activity).inTimetableView;
    return copy;
  }

  toggleSectionInclusionState({ courseName, activity, sectionName }) {
    let copy = _.cloneDeep(this);
    let state = copy.filter
      .get(courseName)
      .subFilter.get(activity)
      .subFilter.get(sectionName);
    copy.filter
      .get(courseName)
      .subFilter.get(activity)
      .subFilter.set(sectionName, !state);
    return copy;
  }

  getSelectedActivityCoursePairsNotInTimetable() {
    let selectedCourseNames = this.getSelectedCourseNames();
    let pairs = [];
    for (let courseName of selectedCourseNames) {
      let res = this.getActivitiesFilterOfCourse(courseName)
        .filter(({ included, inTimetableView }) => included && !inTimetableView)
        .map(({ activity }) => {
          return { activity, courseName };
        });
      pairs.push(...res);
    }
    return pairs;
  }
}

//check draft.js for pattern to update editorState

// isCourseActivityIncluded(courseActivityObj) {
//   return this._getCourseActivityFilter(courseActivityObj).included;
// }

// isSectionIncluded({ courseName, activity, section }) {
//   return this._getCourseActivityFilter({ courseName, activity }).getSection(
//     section
//   ).included;
// }

// isCourseIncluded(courseName) {
//   return this._getCourseFilter(courseName).included;
// }

export default FilterViewState;
