import Time from '../utilities/time';
import TimeInterval from '../utilities/time_interval';
import Timetable from '../utilities/timetable_beta';
import TimeSlot from '../utilities/timeslot';
import { SwitchableTimetable } from '../utilities/switchable';

// test("adding works properly", () => {
//     let t = new Timetable();
//     t.addNormalEntry({name: "y", timeslot: new TimeSlot('Mon', 
//     new TimeInterval(new Time(9, 0), new Time(11, 0)))});
//     t.addNormalEntry({name: "z", timeslot: new TimeSlot('Mon', 
//     new TimeInterval(new Time(11, 0), new Time(12, 0)))});
//     t.addNormalEntry({name: "z", timeslot: new TimeSlot('Mon', 
    // new TimeInterval(new Time(12, 0), new Time(14, 30)))});
    // t.addNormalEntry({name: "z", timeslot: new TimeSlot('Mon', 
    // new TimeInterval(new Time(14, 30), new Time(17, 30)))});
//     console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

// test("alternative mechanisim works properly", () => {
//     let t = new Timetable();
//     t.addNormalEntry({name: "y", timeslot: new TimeSlot('Mon', 
//     new TimeInterval(new Time(9, 0), new Time(11, 0)))});
//     t.addAlternativeEntry({name: 'z', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(12, 0), new Time(14, 0)))});
//     t.addAlternativeEntry({name : 'a', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(14, 0), new Time(17, 0)))});
//     t.chooseAlternative('a');
//     debugger;
//     // console.log(JSON.stringify(t.alternatives, null, 4));
//     // console.log(JSON.stringify(t.chosenAlternative, null, 4));
//     // console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

// test("alternative mechanisim works properly when interval to be removed is the right most and there is a space to the left", () => {
//     let t = new Timetable();
//     t.addNormalEntry({name: "y", timeslot: new TimeSlot('Mon', 
//     new TimeInterval(new Time(9, 0), new Time(11, 0)))});
//     t.addAlternativeEntry({name: 'z', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(19, 0), new Time(21, 0)))});
//     t.addAlternativeEntry({name : 'a', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(15, 0), new Time(17, 0)))});
//     t.chooseAlternative('a');
//     debugger;
//     // console.log(JSON.stringify(t.alternatives, null, 4));
//     // console.log(JSON.stringify(t.chosenAlternative, null, 4));
//     // console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

// test("alternative mechanisim works properly when interval to be removed is the right most and there is no space to the left", () => {
//     let t = new Timetable();
//     t.addNormalEntry({name: "y", timeslot: new TimeSlot('Mon', 
//     new TimeInterval(new Time(9, 0), new Time(11, 0)))});
//     t.addAlternativeEntry({name: 'z', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(19, 0), new Time(21, 0)))});
//     t.addNormalEntry({name: 'b', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(13, 0), new Time(15, 0)))});
//     t.addAlternativeEntry({name : 'a', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(15, 0), new Time(17, 0)))});
//     t.chooseAlternative('a');
//     debugger;
//     // console.log(JSON.stringify(t.alternatives, null, 4));
//     // console.log(JSON.stringify(t.chosenAlternative, null, 4));
//     // console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

// test("alternative mechanisim works properly when interval to be removed is the left most and there is space to the left", () => {
//     let t = new Timetable();
//     t.addAlternativeEntry({name : 'a', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(15, 0), new Time(17, 0)))});
//     t.addAlternativeEntry({name: 'z', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(8, 0), new Time(9, 0)))});
//     t.chooseAlternative('z');
//     debugger;
//     // console.log(JSON.stringify(t.alternatives, null, 4));
//     // console.log(JSON.stringify(t.chosenAlternative, null, 4));
//     // console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

// test("alternative mechanisim works properly when interval to be removed is the left most and there is no space to the left", () => {
//     let t = new Timetable();
//     t.addNormalEntry({name: 'b', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(9, 0), new Time(11, 0)))});
//     t.addAlternativeEntry({name: 'z', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(8, 0), new Time(9, 0)))});
//     t.addAlternativeEntry({name : 'a', timeslot: new TimeSlot('Mon', new TimeInterval(new Time(15, 0), new Time(17, 0)))});
//     t.chooseAlternative('a');
//     debugger;
//     // console.log(JSON.stringify(t.alternatives, null, 4));
//     // console.log(JSON.stringify(t.chosenAlternative, null, 4));
//     // console.log(JSON.stringify(Array.from(t.table.values()), null, 4));
// })

test("", () => {
    let t = new SwitchableTimetable();
    t.addEntry({name: "a", timeslot: new TimeSlot('Wed', 
    new TimeInterval(new Time(9, 0), new Time(15, 0)))});
    t.addEntry({name: "a", timeslot: new TimeSlot('Thu', 
    new TimeInterval(new Time(9, 0), new Time(15, 0)))});

    t.addAlternativeEntry({name: "b", timeslot: new TimeSlot('Fri', 
    new TimeInterval(new Time(8, 0), new Time(10, 0)))});
    t.addAlternativeEntry({name: "b", timeslot: new TimeSlot('Mon', 
    new TimeInterval(new Time(12, 0), new Time(14, 0)))});

    t.addAlternativeEntry({name: "c", timeslot: new TimeSlot('Tue', 
    new TimeInterval(new Time(13, 0), new Time(14, 0)))});
    t.addAlternativeEntry({name: "c", timeslot: new TimeSlot('Mon', 
    new TimeInterval(new Time(18, 0), new Time(20, 0)))});
    t.chooseAlternative('c');
    t.logTable();
})