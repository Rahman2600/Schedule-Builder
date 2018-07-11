export default class TimeInterval {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  intersectsWith(timeInterval) {
    return (this.start.compareTo(timeInterval.end) < 0) &&
           (timeInterval.start.compareTo(this.end) < 0)
  }

  startsAt(time) {
    return this.start.equals(time);
  }

  startAtSameTime(other) {
    return this.start.equals(other.start);
  }

  endAtSameTime(other) {
    return this.end.equals(other.end);
  }

  equals(other) {
    return this.start.equals(other.start) && this.end.equals(other.end);
  }

  joinInterval() {

  }

  splitInterval() {
    
  }


  toString() {
    return this.start.toString() + "-" + this.end.toString();
  }

  //amount of time between start time and end time in minutes
  length() {
    let start = this.start;
    let end = this.end;
    return (end.hour * 60 + end.minute) -
    (start.hour * 60 + start.minute);
  }

  compareTo(timeInterval) {
    return this.start.compareTo(timeInterval.start);
  }
}
