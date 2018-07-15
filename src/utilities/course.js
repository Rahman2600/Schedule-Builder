import { _mapToArrayOfObjects, getIndexOfObjectWith } from './util';

class Course {
    
    constructor (name, sections) {
        this.name = name;
        this.sections = sections;
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

}

export default Course;