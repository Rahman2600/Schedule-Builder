import TimetableWithAlternatives from './timetable_with_options';
import TimeSlot from './timeslot';

const _ = require('lodash');

const generateTimeTables = (courseManager, categoriesToMergeWith) => {
    let allCategories = getAllCategories(courseManager);
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
const getAllCategories = (courseManager) => {
  let allCategories = [];
  for (let course of courseManager) {
    allCategories.push(
      course.getSectionsGroupedByActivity().map(({sections}) => sections)
    );
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
    let staticSections = first.slice(0, first.length - 1);
    let alternativeSections = groupedCombination.map((combination) => {
      return combination[combination.length - 1];
    });
    return {
      staticSections: staticSections,
      alternativeSections: alternativeSections
    };
  });
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
  let staticSections = mergedCombination.staticSections;
  let alternativeSections = mergedCombination.alternativeSections;
  let staticEntries = getAllTimetableEntries(staticSections);
  let alternativeEntries = getAllTimetableEntries(alternativeSections);
  let timetable = new TimetableWithAlternatives(staticEntries, alternativeEntries);
  return timetable;
}

const filterOutInvalidCombinations = (allGroupedCombinations) => {
  return allGroupedCombinations.map((groupedCombinations) => {
    return groupedCombinations.map((groupedCombination) => {
      return groupedCombination.filter(validateCombination);
    }).filter((groupedCombination) => groupedCombination.length !== 0);
  });
}

const getAllTimetableEntries = sections => {
    return _.flatten(
        sections.map((section) => {
            return section.getAllTimetableEntries()
        })
    );
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