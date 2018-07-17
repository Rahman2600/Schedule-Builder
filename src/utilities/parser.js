import Time from './time';
import TimeInterval from './time_interval';
import Section from './section';
import Course from './course';

const parseCourseData = (courseName, sectionsData) => {
  let data = removeDuplicates(sectionsData);
  let requiredFields = ['Section', 'Activity', 'Term', 'Days', 'Start Time', 'End Time'];
  let processedData = filterOutSectionDataWithoutReqFields(data, requiredFields);
  let sections =  apiFormatToProjectFormat(processedData, courseName);
  return new Course(courseName, sections);
}

const removeDuplicates = sectionsData => {
  if (sectionsData.length === 0) return [];
  let dataWithoutDuplicates = [];
  groupEqual(sectionsData);
  dataWithoutDuplicates.push(sectionsData[0]);
  let prevSection = sectionsData[0].Section;
  for (let sectionData of sectionsData) {
    if (sectionData.Section !== prevSection) {
      dataWithoutDuplicates.push(sectionData);
      prevSection = sectionData.Section;
    }
  }
  return dataWithoutDuplicates;
}
 
const filterOutSectionDataWithoutReqFields = (sectionsData, requiredFields) => {
  let processedData = sectionsData.filter((sectionData) => {
    for (let field of requiredFields) {
      if (sectionData['Activity'] === 'Waiting List' ||
          sectionData[field].length === 0 || sectionData['Term'] === '2' ) {
        return false;
      }
    }
    return true;
  });
  return processedData;
}

const apiFormatToProjectFormat = (sectionsData, courseName) => {
  return sectionsData.map((sectionData) => {
    let days = sectionData['Days'].split(" ");
    return new Section({
      courseName: courseName,
      name: sectionData['Section'],
      status: sectionData['Status'],
      activity: sectionData['Activity'],
      term: sectionData['Term'],// 1, 2 or 1-2
      days: days,
      timeInterval: new TimeInterval(timeStringToTime(sectionData['Start Time']), timeStringToTime(sectionData['End Time']))
    });
  }); 
}

const groupEqual = sectionsData => {
  sectionsData.sort((a, b) => {
    if (a.Section < b.Section) return -1;
    else if (a.Section > b.Section) return 1;
    return 0;
  });
}

const timeStringToTime = timeString => {
    let pData = timeString.split(":");
    let t = new Time(Number(pData[0]), Number(pData[1]));
    return t;
}

export default parseCourseData;