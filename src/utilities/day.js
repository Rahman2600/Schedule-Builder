const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class Day {
    constructor(day) {
        this.day = day;
    }

    compareTo(day) {
        return DAYS.indexOf(this.day) - DAYS.indexOf(day); 
    }

    nextDay(day) {
        return DAYS[DAYS.indexOf(this.day) + 1];
    }
}