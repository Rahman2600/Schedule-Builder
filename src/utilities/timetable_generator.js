import Timetable from './timetable';
import TimetableWithOptions from './timetable_with_options';

const _ = require('lodash');

const generateTimeTables = (courseManager, categoriesToMergeWith) => {
    let allCategories = getAllCategories(courseManager);
    let combinationsOfStaticCategories;
    let combinationsOfAlternativeCategories;
    if (!categoriesToMergeWith || categoriesToMergeWith.length === 0) {
        combinationsOfStaticCategories = 
        generateValidCombinations(getSections(allCategories));
        combinationsOfAlternativeCategories = [];
    } else if (categoriesToMergeWith === "all") {
        combinationsOfStaticCategories = [];
        combinationsOfAlternativeCategories = generateValidCombinations(getSections(allCategories));
    } else {
        let staticCategories = [];
        let alternativeCategories = [];
        for (let category of allCategories) {
            if (!categoriesToMergeWith.includes(category.name)) {
                staticCategories.push(category);
            } else {
                alternativeCategories.push(category);
            }
        }
        combinationsOfStaticCategories = generateValidCombinations(getSections(staticCategories));
        combinationsOfAlternativeCategories = generateValidCombinations(
            getSections(alternativeCategories)
        );
    }
    let timetables = getTimetables(combinationsOfStaticCategories, 
        combinationsOfAlternativeCategories); 
    return timetables;
}

const getSections = (categories) => categories.map(({sections}) => sections)

const getTimetables = (combinationsOfStaticCategories, combinationsOfAlternativeCategories) => {
    let timetables;
    if (combinationsOfAlternativeCategories.length === 0) {
        timetables = combinationsOfStaticCategories.map((combination) => {
            return new Timetable(combination);
        });
    }  else if (combinationsOfStaticCategories.length === 0) {
        timetables = combinationsOfAlternativeCategories.map((combination) => {
            return new TimetableWithOptions([], combination);
        })
    } else {
        timetables = [];
        for (let staticSections of combinationsOfStaticCategories) {
            let alternativeCombinations = [];
            for (let alternativeCombination of combinationsOfAlternativeCategories) {
                if (validateCombination(staticSections.concat(alternativeCombination))) {
                    alternativeCombinations.push(alternativeCombination);
                }
            }
            //handle case where there is no vaild complete timetable
            if (alternativeCombinations.length !== 0) {
                timetables.push(new TimetableWithOptions(staticSections, alternativeCombinations));
            }
        }
    } 
    return timetables;  
}

//returns an array of arrays of each of the categories we have to pick from to make a combination
const getAllCategories = (courseManager) => {
  let allCategories = [];
  for (let course of courseManager) {
    allCategories.push(
      course.getSectionsGroupedByActivity().map(({sections, activity}) => {
          return {
              name: course.name + " " + activity,
              sections: sections
          }
        }
      )
    );
  }
  return _.flatten(allCategories);
}

const generateValidCombinations = (allCategories) => {
    let combinations = [];
    generateValidCombinationsHelper(allCategories, 0, [], combinations);
    return combinations;
}

const generateValidCombinationsHelper = (allCategories, index, currentArr, combinations) => {
    if (index === allCategories.length) {
        if (validateCombination(currentArr)) {
            combinations.push(currentArr);
        }
    } else {
        let currentCategory = allCategories[index];
        for (let i = 0; i < currentCategory.length; i++) {
            generateValidCombinationsHelper(allCategories, index + 1,
            currentArr.slice().concat([currentCategory[i]]), combinations);
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