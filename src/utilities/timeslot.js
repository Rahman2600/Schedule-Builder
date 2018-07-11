import Time from './time';
import Day from './day';

export default class TimeSlot {
    constructor(day, interval) {
        this.day = day;
        this.interval = interval;
    }

    compareTo(other) {
        let result = this.day.compareTo(other.day);
        if (result != 0) {
            return result;
        } else {
            return this.interval.compareTo(other.interval);
        }
    }

    onSameDay(dayTimeInterval) {
        return this.day === dayTimeInterval.day;
    }



    //returns false if there is no next for given parameters
    // next(minTime, maxTime) {
    //     if(this.time.compareTo(maxTime) < 0) {
    //         return new DayTimeInterval(this.day, this.time.next());
    //     } else if (this.time.compareTo(maxTime) === 0) {
    //         return new DayTimeInterval(DAYS[DAYS.indexOf(this.day) + 1], minTime);
    //     } else {
    //         return false;
    //     }
    // }
    
        // compareToDayTime(dayTime) {
    //     if ((DAYS.indexOf(this.day) < DAYS.indexOf(dayTimeInterval.day))) {
    //         return -1;
    //     } else if ((DAYS.indexOf(this.day) > DAYS.indexOf(dayTimeInterval.day))) {
    //         return 1;
    //     } else {
    //         return this.interval.startTime.compareTo(dayTime.time);
    //     }
    // }
}



