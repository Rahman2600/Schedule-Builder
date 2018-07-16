import Timetable from './timetable';

//allows you to switch between alternatives
export default class TimetableWithAlternatives extends Timetable {
    constructor(staticEntries, alternativeEntries) {
        super(staticEntries);
        this.alternatives = new Map();
        for (let entry of alternativeEntries) {
            this._addAlternativeEntry(entry);
        }
    }

    getAlternativeSections() {
        return Array.from(this.alternatives.keys());
    }

    getTimetableWithSection(section) {
        let timetable = new Timetable(this.entries);
        for (let timeslot of this.alternatives.get(section)) {
            timetable._addEntry({name: section, timeslot: timeslot});
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

    
    _addAlternativeEntry(entry) {
        let name = entry.name;
        let timeslot = entry.timeslot;
        let storedData = this.alternatives.get(name);
        if (storedData) {
            storedData.push(timeslot);
        } else {
            this.alternatives.set(name, [timeslot]);
        }
    }

}