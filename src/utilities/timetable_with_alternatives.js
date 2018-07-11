import Timetable from './timetable';

//allows you to switch between alternatives
export default class TimetableWithAlternatives extends Timetable {
    constructor() {
        super();
        this.alternatives = new Map();
        this.chosenAlternative = null;
    }

    addAlternativeEntry(entry) {
        let name = entry.name;
        let timeslot = entry.timeslot;
        let storedData = this.alternatives.get(name);
        if (!this.chosenAlternative || this.chosenAlternative === name) {
            this.chosenAlternative = name;
            this.addEntry({name: name, timeslot: timeslot});
        }
        if (storedData) {
            storedData.push(timeslot);
        } else {
            this.alternatives.set(name, [timeslot]);
        }
    }

    getAlternatives() {
        return Array.from(this.alternatives.keys());
    }

    getTableWithAlternative(alternative) {
        let timetable = new Timetable();
        for (let timeslot of this.alternatives.get(alternative)) {
            timetable.addEntry({name: alternative, timeslot: timeslot});
        }
        return timetable;
    }

    getAllTables() {
        let timetables = [];
        for (let alternative of this.alternatives.keys()) {
            let timetable = Object.assign({}, this);
            timetable.chooseAlternative(alternative);
            timetables.push(timetable);
        }
    }

    chooseAlternative(alternative) {
        this.removeAllEntriesWithName(this.chosenAlternative);
        //this.logTable();
        for (let timeslot of this.alternatives.get(alternative)) {
            this.addEntry({name: alternative, timeslot: timeslot});
        }
        this.chosenAlternative = alternative;
    }
}