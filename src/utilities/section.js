import TimeSlot from './timeslot.js';

class Section {

    constructor ({name, days, term, timeInterval, activity}) {
        this.name = name;
        this.days = days;
        this.term = term;
        this.timeInterval = timeInterval;
        this.activity = activity;
    }

    getAllTimetableEntries () {
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