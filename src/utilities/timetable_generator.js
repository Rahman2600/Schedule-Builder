import Timetable from './timetable';
import TimetableWithOptions from './timetable_with_options';

const _ = require('lodash');

const generateTimeTables = (courseManager, categoriesToMergeWith) => {
    if (!courseManager.hasCourses()) return [];
    let allCategories = getAllCategories(courseManager);
    let timetables = getTimetables(allCategories, categoriesToMergeWith); 
    return timetables;
}

const getTimetables = (allCategories, categoriesToMergeWith) => {
    let timetables;
    if (!categoriesToMergeWith || categoriesToMergeWith.length === 0) {
        let defaultCombinations = generateValidCombinations(getSections(allCategories));
        timetables = defaultCombinations.map((combination) => {
            return new Timetable(combination);
        });
    } else if (categoriesToMergeWith === "all") {
        let alternativeCombinations = generateValidCombinations(getSections(allCategories));
        timetables = alternativeCombinations.map((combination) => {
            return new TimetableWithOptions([], combination);
        });
    } else {
        timetables = handleDefaultAndAlternativeCombinationsNotEmptyCase(allCategories, categoriesToMergeWith);
    }
    return timetables;  
}

const handleDefaultAndAlternativeCombinationsNotEmptyCase = (allCategories, categoriesToMergeWith) => {
    let timetables = [];
    let { staticCategories, alternativeCategories } = getStaticAndAlternativeCategories(allCategories, 
        categoriesToMergeWith);
    let defaultCombinations = generateValidCombinations(getSections(staticCategories));
    let alternativeCombinations = generateValidCombinations(getSections(alternativeCategories));
    for (let staticSections of defaultCombinations) {
        let compatibleCombinations = [];
        for (let alternativeCombination of alternativeCombinations) {
            if (validateCombination(staticSections.concat(alternativeCombination))) {
                compatibleCombinations.push(alternativeCombination);
            }
        }
        //handle case where there is no vaild complete timetable
        if (compatibleCombinations.length !== 0) {
            timetables.push(new TimetableWithOptions(staticSections, compatibleCombinations));
        }
    }
    return timetables;
}

const getStaticAndAlternativeCategories = (allCategories, categoriesToMergeWith) => {
    let staticCategories = [];
    let alternativeCategories = [];
    for (let category of allCategories) {
        if (!categoriesToMergeWith.includes(category.name)) {
            staticCategories.push(category);
        } else {
            alternativeCategories.push(category);
        }
    }
    return { 
        staticCategories: staticCategories,
        alternativeCategories: alternativeCategories
    }
}

const getSections = (categories) => categories.map(({sections}) => sections)

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


export default generateTimeTables;