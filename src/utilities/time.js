//represents time in multiples of 30 minutes
//CLASS-INVARIANT: hour is integer between 0 and 23, minute is 0, or 30
export default class Time {

    constructor(hour, minute) {
        this.hour = hour;
        this.minute = minute;
    }
    
    equals(other) {
        return this.compareTo(other) === 0;
    }

    compareTo(time) {
        if (time.hour == this.hour  && time.minute == this.minute) {
          return 0;
        }
        else if ((this.hour > time.hour) || ((this.hour == time.hour) &&
           (this.minute > time.minute)))
           { return 1; }
        else { return -1; }
    }

    //returns new time increased by 30 minutes
    next() {
      if (this.minute === 0) {
        return new Time(this.hour, 30);
      } else {
        return new Time(this.hour + 1, 0);
      }
    }

    toString() {
        if (this.minute == 0) {
            return this.hour + ":00";
        } else return this.hour + ":30";
    }

    // //generate times from start up to and including end
    // static times(start, end) {
    //   let times = [];
    //   for(let current = start; current.compareTo(end) < 0;
    //       current = Time.next(current)) {
    //      times.push(current);
    //   }
    //
    //
    // }

    // //return number of minutes between two times, negative if given time is
    // //later in the day
    // timeBetween(time) {
    //   return (time.hour * 60 + Time.minute) - (this.hour * 60 + this.minute);
    // }
}

{/* for(let current = new Time(8, 0); current.compareTo(new Time(20, 0)); current = current.next()) {
                            
                        } */}