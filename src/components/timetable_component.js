import React from 'react';
import Time from '../utilities/time';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function timetable(props) {
    return renderTimetable(props.timetable);
}

const renderDayHeaders = () => {
    return DAYS.map((day) => {
        return <th key={day}> {day} </th>;
    });
}

function renderTimetable(timetable) {
    return (
        <table>
                <thead>
                    <tr>
                        <th></th>
                        {renderDayHeaders()}
                    </tr>
                </thead>
                <tbody>{renderTimetableBody(timetable)}</tbody>
        </table>
    );
}

function renderTimetableBody (timetable) {
    let times = generateTimes();
    return times.map((time, i) => {
        return (
            <tr key={i}>
                <th key={time.toString()+i}>{time.toString()}</th>
                {renderTime(time, timetable)}
            </tr>
        );
    });
}

function renderTime(time, timetable) {
    return Array.from(timetable.getTable()).map((value, i) => {
        for (let section of value) {
            if (section.interval.startsAt(time)) {
                return (
                    <td rowSpan={(section.interval.length()/30)} key={section.interval+i}>
                        {section.name}
                    </td>
                );
            }
        } 
    });
}

const generateTimes = () => {
  let times = [];
  for(let current = new Time(8, 0); current.compareTo(new Time(21, 0)) <= 0; current = current.next()){
    times.push(current);
  }
  return times;
}




export default timetable;

