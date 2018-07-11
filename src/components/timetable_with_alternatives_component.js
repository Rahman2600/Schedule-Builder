import React, { Component } from 'react';
import Timetable from './timetable_component';

export default class TimetableWithAlternatives extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedAlternative: props.timetable.chosenAlternative};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let chosenAlternative = event.target.value;
        this.props.timetable.chooseAlternative(chosenAlternative);
        this.setState({selectedAlternative: chosenAlternative});
    }

    render() {
        return ( 
            <div>
                <Timetable timetable={this.props.timetable}/>
                <select value={this.state.selectedAlternative} onChange={this.handleChange}> 
                    {
                        this.props.timetable.getAlternatives().map((alternative) => {
                            return (
                                    <option key={alternative} value={alternative}> 
                                        {alternative} 
                                    </option>
                            );
                        })
                    }
                </select>
            </div>
        );
    }

}