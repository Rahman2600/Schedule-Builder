import React, { Component } from 'react';

import Timetable from './timetable_component';
import Dropdown from './dropdown';
import CheckList from './check_list';
import { getUpdatedStateOnSelectChange } from '../state/check_list_state';

class TimetableViewer extends Component {
    constructor(props) {
        super(props);
        this.state = TimetableViewer._getInitialState(props);
        this._getExpandButton = this._getExpandButton.bind(this);
        this._getHideSectionsFromSelectCategoriesButton = this._getHideSectionsFromSelectCategoriesButton.bind(this);
        this.onClickLeft = this.onClickLeft.bind(this);
        this.onClickRight = this.onClickRight.bind(this);
        this.onClickExpand = this.onClickExpand.bind(this);
        this.onClickHideSectionsFromSelectedCategories = this.onClickHideSectionsFromSelectedCategories.bind(this);
        this.onChangeSectionCombination = this.onChangeSectionCombination.bind(this);
        this._getStateUpdatesWithPreviousClicked = this._getStateUpdatesWithPreviousClicked.bind(this);
        this._getStateUpdatesWithNextClicked = this._getStateUpdatesWithNextClicked.bind(this);
        this._getOptionsToShow = this._getOptionsToShow.bind(this);
        this._getTimetableToShow = this._getTimetableToShow.bind(this);
        this._getSelectedSectionCombinationWithState = this._getSelectedSectionCombinationWithState.bind(this);
        this._getAlternativeCombinationsInCurrentTimetable = this._getAlternativeCombinationsInCurrentTimetable.bind(this);
        this.onSectionsSelectedChange = this.onSectionsSelectedChange.bind(this);
        this._updateStateWithSectionsCheckState = this._updateStateWithSectionsCheckState.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.id !== state.id) {
            let nextState = TimetableViewer._getInitialState(props);
            if (props.isViewingTimetablesWithOptions) {
                nextState.hideSectionsFromSelectedCategories = state.hideSectionsFromSelectedCategories;
            }
            return nextState;
        }
        return null;
    }

    static _getInitialState(props) {
        let initalState = {};
        initalState.id = props.id;
        if (props.timetables) {
            initalState.currentTimetableIndex = 0;
            if (props.isViewingTimetablesWithOptions) {
                initalState.currentSectionCombinationIndex = 0;
                initalState.expanded = false;
                initalState.hideSectionsFromSelectedCategories = false;
                let timetable = props.timetables[0];
                initalState.sectionsCheckState = TimetableViewer._getSectionCheckState(timetable);
            }
        }
        return initalState;
    }

    static _getSectionCheckState(timetable) {
        return timetable.getAlternativeSections().map((section) => {
                return {value: section, checked: true};
        });
    }

    render() {
        let isViewingTimetablesWithOptions = this.props.isViewingTimetablesWithOptions;
        if (this.props.timetables.length > 0) {
            return (
                <div>                    
                    <button type="button" onClick={this.onClickLeft}>previous</button>
                    <button type="button" onClick={this.onClickRight}>next</button>
                    {(isViewingTimetablesWithOptions && !this.state.expanded)
                    ? 
                    <span>
                        {this._getExpandButton()}
                        {this._getHideSectionsFromSelectCategoriesButton()}
                    </span> : 
                     (isViewingTimetablesWithOptions ?
                                this._getExpandButton() : null)
                    }
                    <Timetable timetable={this._getTimetableToShow()} />
                    { this.props.isViewingTimetablesWithOptions ?
                        <div>
                            <Dropdown 
                                selected={this._getSelectedSectionCombinationWithState()} 
                                options={this._getOptionsToShow()} 
                                onChange={this.onChangeSectionCombination}
                            /> 
                            <CheckList 
                                    list={this.state.sectionsCheckState}
                                    onChange={this.onSectionsSelectedChange}
                            />
                        </div>
                        : null}
                    <p> 
                        {this.state.currentTimetableIndex + 1} 
                        {' of '}
                        {this.props.timetables.length} </p>
                </div>
            );
        } else return <p> No Timetables to show </p>;
    }

    _getExpandButton() {
        return (
            <button type="button" onClick={this.onClickExpand}>
                        {this.state.expanded ? 'contract' : 'expand'} 
            </button> 
        );
    }

    _getHideSectionsFromSelectCategoriesButton() {
        return (
            <button type="button" onClick={this.onClickHideSectionsFromSelectedCategories}>
                {this.state.hideSectionsFromSelectedCategories ? 
                'showSectionsFromSelectedCategories' : 'hideSectionsFromSelectedCategories'} 
            </button>
        )
    }

    onClickLeft() {
        this.setState((prevState) => this._getStateUpdatesWithPreviousClicked(prevState));
    }

    onClickRight() {
        this.setState((prevState) => {
            let state = this._getStateUpdatesWithNextClicked(prevState);
            return state;
        });
    }

    onClickExpand() {
        this.setState((prevState) => {
            return {expanded: !prevState.expanded,
                    hideSectionsFromSelectedCategories: false}
        })
    }

    onClickHideSectionsFromSelectedCategories() {
        this.setState((prevState) => {
            return {hideSectionsFromSelectedCategories: !prevState.hideSectionsFromSelectedCategories}
        })
    }

    onChangeSectionCombination(event) {
        let selected = event.target.value;
        this.setState({ 
            currentSectionCombinationIndex: 
            this._getAlternativeCombinationsInCurrentTimetable().indexOf(selected),
            hideSectionsFromSelectedCategories: false});
    }

    //TODO: update selectedSectionCombinationIndex accordingly
    onSectionsSelectedChange(category) {
        this.setState((prevState) => {
            let nextState = { sectionsCheckState: 
                getUpdatedStateOnSelectChange(category, prevState.sectionsCheckState, true)}
            let prevSelected = this._getSelectedSectionCombinationWithState(prevState);
            let state = {};
            state.sectionsCheckState = nextState.sectionsCheckState;
            state.currentTimetableIndex = this.state.currentTimetableIndex;
            let newOptions = this._getOptionsToShow(state);
            let pos = newOptions.indexOf(prevSelected);
            if (pos != - 1) {
                nextState.currentSectionCombinationIndex = pos;
            } else {
                nextState.currentSectionCombinationIndex = 0;
            }
            return nextState;
        });
    }

    _getStateUpdatesWithPreviousClicked({expanded, currentTimetableIndex, 
        currentSectionCombinationIndex}) {
        let nextState = {};
        if (expanded && (currentSectionCombinationIndex > 0)) {
            nextState.currentSectionCombinationIndex = currentSectionCombinationIndex - 1;
        } else if (expanded && currentSectionCombinationIndex === 0 &&
                   (currentTimetableIndex > 0)) {
            nextState.currentTimetableIndex = currentTimetableIndex - 1;
            let num = this._getNumberOfOptionsToShowWithState(nextState);
            nextState.currentSectionCombinationIndex = num - 1;
        } else if (currentTimetableIndex > 0) {
            nextState.currentTimetableIndex = currentTimetableIndex - 1;
        }

        this._updateStateWithSectionsCheckState(nextState);
        return nextState;
    }

    _getStateUpdatesWithNextClicked({expanded, currentTimetableIndex, 
        currentSectionCombinationIndex}) {
        let nextState = {};
        if (expanded && (currentSectionCombinationIndex < 
            this._getNumberOfOptionsToShowWithState() - 1)) {
            nextState.currentSectionCombinationIndex = currentSectionCombinationIndex + 1;
        } else if (expanded) {
            nextState.currentSectionCombinationIndex = 0;
            nextState.currentTimetableIndex = currentTimetableIndex + 1;
        } else if (currentTimetableIndex < this.props.timetables.length - 1) {
            nextState.currentTimetableIndex = currentTimetableIndex + 1;
        }

        this._updateStateWithSectionsCheckState(nextState);
        return nextState;
    }

    _getTimetableToShow() {
        let props = this.props;
        let state = this.state;
        if (props.isViewingTimetablesWithOptions) {
            let timetable = props.timetables[state.currentTimetableIndex];
            if (!state.hideSectionsFromSelectedCategories) {
                return timetable.getTimetableWithSectionCombination(
                    this._getOptionsToShow()[state.currentSectionCombinationIndex]
                );
            } else {
                return timetable;
            }
        }
        else {
            return props.timetables[state.currentTimetableIndex];
        }
    }

    _getOptionsToShow(state) {
        let stateInFunc = state ? state : this.state;
        let checkState = this.state.sectionsCheckState;
        let sectionNames = checkState.map(({value}) => value);
        let checkList = checkState.map(({checked}) => checked);
        let timetable = this.props.timetables[stateInFunc.currentTimetableIndex];
        let unfiltered = timetable.getAlternativeSectionCombinations();
        let options = unfiltered.filter((combination) => {
            let sections = combination.split(",");
            for (let section of sections) {
                let index = sectionNames.indexOf(section);
                if (!checkList[index]) {
                    return false;
                } 
            }
            return true;
        });
        return options;
    }

    _getSelectedSectionCombinationWithState(state) {
        return state ? this._getOptionsToShow()[state.currentSectionCombinationIndex] :
        this._getOptionsToShow()[this.state.currentSectionCombinationIndex];
    }

    _getAlternativeCombinationsInCurrentTimetable() {
        return this._getTimetableWithState()
        .getAlternativeSectionCombinations();
    }

    _updateStateWithSectionsCheckState(state) {
        if (Number.isInteger(state.currentTimetableIndex) && this.props.isViewingTimetablesWithOptions) {
            let timetable = this.props.timetables[state.currentTimetableIndex];
            state.sectionsCheckState = TimetableViewer._getSectionCheckState(timetable);
        }
    }

    _getNumberOfOptionsToShowWithState(state) {
        return state ? this._getOptionsToShow(state).length : this._getOptionsToShow().length;
    }

    _getTimetableWithState(state) {
        let timetables = this.props.timetables; 
        return state ? timetables[state.currentTimetableIndex] : timetables[this.state.currentTimetableIndex];
    }
}

export default TimetableViewer;