//representation of a timetable
import Time from './time';
import Timeline from './timeline';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MIN_TIME = new Time(8, 0);
const MAX_TIME = new Time(21, 30);

//represents timetable as timelines on different days
export default class Timetable {
    constructor(entries) {
        this.table = new Map();
        this.entries = entries;
        for (let day of DAYS) {
            this.table.set(day, new Timeline(MIN_TIME, MAX_TIME));
        }
        for (let entry of entries) {
            this._addEntry(entry);
        }
    }

    _addEntry({name, timeslot}) {
        let timeline =  this.table.get(timeslot.day);
        timeline.addInterval({key: name, interval: timeslot.interval});
    }

    removeAllEntriesWithName(name) {
        for (let day of DAYS) {
            this.table.get(day).removeInterval(name);
        }
    }

    getTable() {
        let table = [];
        for (let day of DAYS) {
            table.push(this.table.get(day).getAllKeyValuePairs());
        }
        return table;
    }

    logTable() {
        for (let day of this.table.keys()) {
            console.log(day, JSON.stringify(this.table.get(day).getAllKeyValuePairs(), null, 4));
        }
    }
}
