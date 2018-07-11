import Timeline from "../utilities/timeline";
import TimeInterval from "../utilities/time_interval";
import Time from "../utilities/time";

// test("constructor works properly", () => {
//     let tm1 = new Timeline(new Time(8, 0), new Time(21, 0));
//     // tm1.addTimeInterval({key: "a", 
//     // interval: new TimeInterval(new Time(8, 0), new Time(12, 0))})
//     // tm1.addTimeInterval({key: "b", 
//     // interval: new TimeInterval(new Time(12, 0), new Time(14, 0))})
//     //console.log(JSON.stringify(tm1.getAllKeyValuePairs(), null, 4));
//     tm1.addTimeInterval({key: "a", 
//     interval: new TimeInterval(new Time(8, 0), new Time(9, 0))})
//     tm1.addTimeInterval({key: "b", 
//     interval: new TimeInterval(new Time(12, 0), new Time(14, 0))})
//     tm1.addTimeInterval({key: "c", 
//     interval: new TimeInterval(new Time(15, 0), new Time(17, 0))})
//     tm1.addTimeInterval({key: "d", 
//     interval: new TimeInterval(new Time(17, 0), new Time(21, 0))})
//     // tm1.addTimeInterval({key: "c", 
//     // interval: new TimeInterval(new Time(10, 0), new Time(12, 0))})
//     tm1.removeTimeInterval("d");
//     //tm1.removeTimeInterval("a");
//     //console.log(JSON.stringify(tm1.getAllKeyValuePairs(), null, 4));
//     // tm1.addTimeInterval({key: "d", 
//     // interval: new TimeInterval(new Time(18, 0), new Time(21, 0))})
//     console.log(JSON.stringify(tm1.getAllKeyValuePairs(), null, 4));
// })