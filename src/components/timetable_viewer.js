import React, { Component } from 'react';
import TimetableWithAlternatives from './timetable_with_alternatives_component';

class TimetableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { currentIndex : 0, expanded: false}
        this.onClickLeft = this.onClickLeft.bind(this);
        this.onClickRight = this.onClickRight.bind(this);
        this.onClickExpand = this.onClickExpand.bind(this);
    }

    render() {
        if (this.props.timetables.length !== 0) {
            return (
                <div>                    
                    <button type="button" onClick={this.onClickLeft}>previous</button>
                    <button type="button" onClick={this.onClickRight}>next</button>
                    <button type="button" onClick={this.onClickExpand}>
                            {this.state.expanded ? 'contract' : 'expand'}
                    </button>
                    <TimetableWithAlternatives 
                        timetable={this.props.timetables[this.state.currentIndex]}/>
                    <p> {this.state.currentIndex + 1} of {this.props.timetables.length} </p>
                </div>
            );
        } else return <p> No Timetables to show </p>;
    }

    onClickLeft() {
        this.setState((prevState) => {
            if (prevState.currentIndex !== 0) {
                let nextIndex = prevState.currentIndex - 1;
                return { currentIndex: nextIndex};
            }
        }); 
    }

    onClickRight() {
        this.setState((prevState) => {
            if (prevState.currentIndex < this.props.timetables.length - 1) {
                let nextIndex = prevState.currentIndex + 1;
                return { currentIndex: prevState.currentIndex + 1};
            } 
        }); 
    }

    onClickExpand() {
        this.setState((prevState) => {
            { expanded: !prevState.expanded }
        }); 
    }      
}

export default TimetableViewer;