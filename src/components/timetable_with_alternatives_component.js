import React from 'react';
import Timetable from './timetable_component';
import Dropdown from './dropdown'

export default function TimetableWithOptions(props) {
    return ( 
        <div>
            <Timetable timetable={props.timetable}/>
            <Dropdown selected={props.selected} options={props.options} onChange={props.handleChange}/>
        </div>
    );
}
