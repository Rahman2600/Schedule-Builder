import React, { Component } from 'react';
import Timetable from './timetable_component';
import Dropdown from './dropdown';

class TimetableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = TimetableViewer._getStateWithTimetableIndex(0, props);
        this.onClickLeft = this.onClickLeft.bind(this);
        this.onClickRight = this.onClickRight.bind(this);
        this.onChangeSectionCombination = this.onChangeSectionCombination.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.id !== state.id) {
            return TimetableViewer._getStateWithTimetableIndex(0, props);
        }
        return null;
    }

    render() {
        let timetable;
        if (this.props.isViewingTimetablesWithOptions) {
            timetable = this.state.timetable.getTimetableWithSectionCombination(
                this.state.selectedSectionCombination
            )
        } else {
            timetable = this.state.timetable;
        }
        if (timetable) {
            return (
                <div>                    
                    <button type="button" onClick={this.onClickLeft}>previous</button>
                    <button type="button" onClick={this.onClickRight}>next</button>
                    <Timetable timetable={timetable} />
                    { this.props.isViewingTimetablesWithOptions ?
                        <Dropdown 
                            selected={this.selectedSectionCombination} 
                            options={this.state.timetable.getAlternativeCombinations()} 
                            onChange={this.onChangeSectionCombination}
                        /> : null}
                    <p> {this.state.currentIndex + 1} of {this.props.timetables.length} </p>
                </div>
            );
        } else return <p> No Timetables to show </p>;
    }

    onChangeSectionCombination(event) {
        let selected = event.target.value;
        this.setState({ selectedSectionCombination: selected });
    }

    onClickLeft() {
        this.setState((prevState) => {
            if (prevState.currentIndex !== 0) {
                let nextIndex = prevState.currentIndex - 1;
                return TimetableViewer._getStateWithTimetableIndex(nextIndex, this.props);
            }
        }); 
    }

    onClickRight() {
        this.setState((prevState) => {
            if (prevState.currentIndex < this.props.timetables.length - 1) {
                let nextIndex = prevState.currentIndex + 1;
                return TimetableViewer._getStateWithTimetableIndex(nextIndex, this.props);
            } 
        }); 
    }

    static _getStateWithTimetableIndex(index, props) {
        let timetable = props.timetables[index];
        let state = { 
            currentIndex: index,
            timetable: timetable,
            id: props.id
        }
        if (props.isViewingTimetablesWithOptions) {
            state.selectedSectionCombination = timetable.getAlternativeCombinations()[0];
        }
        return state;
    }
     
}

export default TimetableViewer;