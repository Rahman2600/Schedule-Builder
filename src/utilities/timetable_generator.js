// @flow
import TimetableWithAlternatives from './timetable_with_alternatives';
import TimeSlot from './timeslot';

const _ = require('lodash');

const generateTimeTables = coursesData => {
  if (coursesData.length === 0) return [];
  let allCategories = getAllCategories(coursesData); 
  let allGroupedCombinations = generateGroupedCombinations(allCategories);
  let validCombinations = filterOutInvalidCombinations(allGroupedCombinations);
  if (validCombinations.length === 0) return [];
  let smallestGroupedCombination = getSmallestArray(validCombinations);
  if (smallestGroupedCombination.length === 0) return [];
  let mergedCombinations = mergeCombinations(smallestGroupedCombination);
  let timetables = makeTimetables(mergedCombinations);
  return timetables;
}

//returns an array of arrays of each of the categories we have to pick from to make a combination
const getAllCategories = coursesData => {
  let allCategories = [];
  for (let courseData of coursesData) {
    let categories = getCategories(courseData);
    allCategories.push(categories);
  }
  return _.flatten(allCategories);
}

/* returns an array of combinations grouped by the section that is last in each of the combinations in 
that category */
const generateGroupedCombinations = (allCategories) => {
  if (allCategories.length === 0) return [];
  let groupedCombinations = [];
  for (let i = 0; i < allCategories.length; i++) {
    let nextArr = swapLastWith(i, allCategories);
    let combinationsWithArr = [];
    generateGroupedCombinationsHelper(nextArr, 0, [], combinationsWithArr, true);
    groupedCombinations.push(combinationsWithArr);
  }
  return groupedCombinations;
}

const mergeCombinations = groupedCombinations => {
  return groupedCombinations.map((groupedCombination) => {
    let first = groupedCombination[0];
    let staticEntries = first.slice(0, first.length - 1);
    let alternatives = groupedCombination.map((combination) => {
      return combination[combination.length - 1];
    });
    return {
      staticEntries: staticEntries,
      alternatives: alternatives
    };
  });
}

const getCategories = courseData => {
  let categories = new Map();
  for (let sectionData of courseData) {
    let storedData = categories.get(sectionData.activity);
    if (storedData) {
      storedData.push(sectionData);
    } else {
      categories.set(sectionData.activity, [sectionData]);
    }
  }
  return Array.from(categories.values());
}

const makeTimetables  = (mergedCombinations) => {
  return mergedCombinations.map((mergedCombination) => {
    return makeTimetable(mergedCombination);
  });
}

const generateGroupedCombinationsHelper = (allCategories, index, currentArr, groupedCombinations, 
firstOfIndex) => {
  if (index === allCategories.length) {
    if (firstOfIndex) {
      groupedCombinations.push([]);
    }
    groupedCombinations[groupedCombinations.length - 1].push(currentArr);
  } else {
      let currentCategory = allCategories[index];
      for (let i = 0; i < currentCategory.length; i++) {
        let firstOfIndex = (i === 0);
        generateGroupedCombinationsHelper(allCategories, index + 1,
        currentArr.slice().concat([currentCategory[i]]), groupedCombinations, firstOfIndex);
      }
  }
}

const validateCombination = combination => {
  for (let i = 0; i < combination.length; i++) {
    for (let j = i + 1; j < combination.length; j++) {
      if (combination[i].timeInterval.intersectsWith(combination[j].timeInterval)) {
        return false;
      }
    }
  }
  return true;
}

const makeTimetable = mergedCombination => {
  let timetable = new TimetableWithAlternatives();
  for (let sectionData of mergedCombination.staticEntries) {
    addNormalTimetableEntry(sectionData, timetable);
  }
  for (let sectionData of mergedCombination.alternatives) {
    addAlternativeTimetableEntry(sectionData, timetable);
  }
  return timetable;
}

const filterOutInvalidCombinations = (allGroupedCombinations) => {
  return allGroupedCombinations.map((groupedCombinations) => {
    return groupedCombinations.map((groupedCombination) => {
      return groupedCombination.filter(validateCombination);
    }).filter((groupedCombination) => groupedCombination.length !== 0);
  });
}

const addNormalTimetableEntry = (sectionData, timetable) => {
  for (let day of sectionData.days) {
    timetable.addEntry({
      name: sectionData.name,
      timeslot: new TimeSlot(day, sectionData.timeInterval)
    });
  }
}

const addAlternativeTimetableEntry = (sectionData, timetable) => {
  for (let day of sectionData.days) {
    timetable.addAlternativeEntry({
      name: sectionData.name,
      timeslot: new TimeSlot(day, sectionData.timeInterval)
    });
  }
}

const getSmallestArray = (_2dArray) => {
  let smallestArray;
  let smallestLengthSoFar = Number.POSITIVE_INFINITY;
  for (let array of _2dArray) {
    if (array.length < smallestLengthSoFar) {
      smallestArray = array;
      smallestLengthSoFar = array.length;
    }
  }
  return smallestArray;
}

const swapLastWith = (index, arr) => {
  let copy = arr.slice();
  let lastIndex = copy.length -  1;
  let entryAtIndex = copy[index];
  let lastEntry = copy[lastIndex];
  copy[index] = lastEntry;
  copy[lastIndex] = entryAtIndex;
  return copy;
}

export default generateTimeTables;


