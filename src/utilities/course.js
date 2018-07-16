import { _mapToArrayOfObjects, getIndexOfObjectWith } from './util';

class Course {
    
    constructor (name, sections) {
        this.name = name;
        this.sections = sections;
    }

    getAllActivities() {
        let activities = [];
        for (let section of this.sections) {
            if (!activities.includes(section.activity)) {
                activities.push(section.activity);
            }
        }
        return activities;
    }

    getAllSectionNames() {
        return this.sections.map(({name}) => name);
    }

    getSectionsGroupedByActivity() {
        let groupsMap = new Map();
        for (let section of this.sections) {
            let storedData = groupsMap.get(section.activity);
            if (storedData) {
                storedData.push(section);
            } else {
                groupsMap.set(section.activity, [section]);
            }
        }
        return _mapToArrayOfObjects(groupsMap, "activity", "sections");
    }

    getSection(sectionName) {
        let index = this.sections.map(({name}) => name).indexOf(sectionName);
        return this.sections[index];
    }

}

export default Course;