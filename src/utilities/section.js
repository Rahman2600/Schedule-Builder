import TimeSlot from './timeslot.js';

class Section {

    constructor ({courseName, name, days, term, timeInterval, activity}) {
        this.courseName = courseName;
        this.name = name;
        this.days = days;
        this.term = term;
        this.timeInterval = timeInterval;
        this.activity = activity;
    }

    getTimetableEntries () {
        let entries = [];
        for (let day of this.days) {
            entries.push({
                name: this.name,
                timeslot: new TimeSlot(day, this.timeInterval)
            });
        }
        return entries;
    }
}

export default Section;