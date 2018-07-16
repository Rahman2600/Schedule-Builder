import React, { Component } from 'react';
import Timetable from './timetable_component';
import Dropdown from './dropdown';

class TimetableViewer extends Component {
    constructor(props) {
        super(props);
        let timetables = props.timetables;
        let timetable = timetables[0];
        let sections = timetable.getAlternativeSections();
        let section = sections[0];
        this.state = { 
            currentIndex : 0, 
            timetable: timetable, 
            selectedSection: section
        }
        this.onClickLeft = this.onClickLeft.bind(this);
        this.onClickRight = this.onClickRight.bind(this);
        this.onChangeSection = this.onChangeSection.bind(this);
        this._getStateWithTimetablesIndex = this._getStateWithTimetablesIndex.bind(this);
    }

    render() {
        let timetable = this.state.timetable;
        if (timetable) {
            return (
                <div>                    
                    <button type="button" onClick={this.onClickLeft}>previous</button>
                    <button type="button" onClick={this.onClickRight}>next</button>
                    <Timetable timetable={timetable.getTimetableWithSection(
                        this.state.selectedSection
                    )} />
                    <Dropdown 
                        selected={this.selectedOption} 
                        options={this.state.timetable.getAlternativeSections()} 
                        onChange={this.onChangeSection}
                    />
                    <p> {this.state.currentIndex + 1} of {this.props.timetables.length} </p>
                </div>
            );
        } else return <p> No Timetables to show </p>;
    }

    onChangeSection(event) {
        let selected = event.target.value;
        this.setState({ selectedSection: selected });
    }

    onClickLeft() {
        this.setState((prevState) => {
            if (prevState.currentIndex !== 0) {
                let nextIndex = prevState.currentIndex - 1;
                return this._getStateWithTimetablesIndex(nextIndex);
            }
        }); 
    }

    onClickRight() {
        this.setState((prevState) => {
            if (prevState.currentIndex < this.props.timetables.length - 1) {
                let nextIndex = prevState.currentIndex + 1;
                return this._getStateWithTimetablesIndex(nextIndex);
            } 
        }); 
    }

    _getStateWithTimetablesIndex(index) {
        let timetable = this.props.timetables[index];
        return { 
            currentIndex: index,
            timetable: timetable,
            selectedSection: timetable.getAlternativeSections()[0]
        }
    }
     
}

export default TimetableViewer;