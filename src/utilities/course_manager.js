//interface for courses
class CourseManager {
    constructor() {
        this.courses = [];
    }

    addCourse(course) {
        this.courses.push(course);
    }

    removeCourse(courseName) {
        let pos = this._getCourseIndex(courseName);
        this.courses.splice(pos, pos + 1);
    }

    getAllCourseNames() {
        return this.courses.map((course) => course.name);
    }

    getSection(sectionName) {
        for (let course of this.courses) {
            let section = course.getSection(sectionName);
            if (section) {
                return section;
            }
        }
    }

    _getCourseWithName(courseName) {
        for (let course of this.courses) {
            if (course.name === courseName) {
                return course;
            }
        }
    }

    _getCourseIndex(courseName) {
        let pos;
        for (let i = 0; i < this.courses.length; i++) {
            if (this.courses[i].name === courseName) {
                pos = i;
            }
        }
        return pos;
    }
}

CourseManager.prototype[Symbol.iterator] = function() {;
    return this.courses[Symbol.iterator]();
}

export default CourseManager;








