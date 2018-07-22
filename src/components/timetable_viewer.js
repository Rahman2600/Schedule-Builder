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
        this._getOptionsToShowWithState = this._getOptionsToShowWithState.bind(this);
        this._getTimetableToShow = this._getTimetableToShow.bind(this);
        this._getSelectedSectionCombinationWithState = this._getSelectedSectionCombinationWithState.bind(this);
        this._getAlternativeCombinationsInCurrentTimetable = this._getAlternativeCombinationsInCurrentTimetable.bind(this);
        this.onSectionsSelectedChange = this.onSectionsSelectedChange.bind(this);
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
            initalState.timetableIndex = 0;
            if (props.isViewingTimetablesWithOptions) {
                initalState.sectionCombinationIndex = 0;
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
        let timetable = this._getTimetableToShow();
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
                    <Timetable timetable={timetable} />
                    { this.props.isViewingTimetablesWithOptions ?
                        <div>
                            <Dropdown 
                                selected={this._getSelectedSectionCombinationWithState()} 
                                options={this._getOptionsToShowWithState()} 
                                onChange={this.onChangeSectionCombination}
                            /> 
                            <CheckList 
                                    list={this.state.sectionsCheckState}
                                    onChange={this.onSectionsSelectedChange}
                            />
                        </div>
                        : null}
                    <p> 
                        {this.state.timetableIndex + 1} 
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
            sectionCombinationIndex: 
            this._getOptionsToShowWithState().indexOf(selected),
            hideSectionsFromSelectedCategories: false});
    }

    onSectionsSelectedChange(category) {
        this.setState((prevState) => {
            let nextSectionsCheckState = getUpdatedStateOnSelectChange(category, prevState.sectionsCheckState, true);
            let nextState = { sectionsCheckState: 
                nextSectionsCheckState}
            let prevSelected = this._getSelectedSectionCombinationWithState(prevState);
            let newOptions = this._getOptionsToShowWithState({
                timetableIndex : prevState.timetableIndex,
                sectionsCheckState: nextSectionsCheckState
            });
            let pos = newOptions.indexOf(prevSelected);
            if (pos != - 1) {
                nextState.sectionCombinationIndex = pos;
            } else {
                nextState.sectionCombinationIndex = 0;
            }
            return nextState;
        });
    }

    //Put timetable index and sectionCombinationIndex in a class
    _getStateUpdatesWithPreviousClicked(prevState) {
        let expanded = prevState.expanded;
        let timetableIndex = prevState.timetableIndex;
        let sectionCombinationIndex = prevState.sectionCombinationIndex;
        let nextState = {};
        if (expanded && (sectionCombinationIndex > 0)) {
            nextState.sectionCombinationIndex = sectionCombinationIndex - 1;
        } else if (expanded && sectionCombinationIndex === 0 &&
                   (timetableIndex > 0)) {
            let nextTimetableIndex = timetableIndex - 1;
            let nextSectionsCheckState = this._getSectionsCheckStateWithState({
                timetableIndex: nextTimetableIndex
            });
            let numOptionsInNextTimetable = this._getNumberOfOptionsToShowWithState({
                timetableIndex: nextTimetableIndex,
                sectionsCheckState: nextSectionsCheckState
            });
            nextState.timetableIndex = nextTimetableIndex;
            nextState.sectionCombinationIndex = numOptionsInNextTimetable - 1;
            nextState.sectionsCheckState = this._getSectionsCheckStateWithState(nextState);
        } else if (timetableIndex > 0) {
            nextState.timetableIndex = timetableIndex - 1;
            nextState.sectionsCheckState = this._getSectionsCheckStateWithState(nextState);
        }

        return nextState;
    }

    _getStateUpdatesWithNextClicked({expanded, timetableIndex, 
        sectionCombinationIndex}) {
        let nextState = {};
        if (expanded && (sectionCombinationIndex < 
            this._getNumberOfOptionsToShowWithState() - 1)) {
            nextState.sectionCombinationIndex = sectionCombinationIndex + 1;
        } else if (expanded && timetableIndex < this.props.timetables.length - 1) {
            nextState.sectionCombinationIndex = 0;
            nextState.timetableIndex = timetableIndex + 1;
            nextState.sectionsCheckState = this._getSectionsCheckStateWithState(nextState);
        } else if (timetableIndex < this.props.timetables.length - 1) {
            nextState.timetableIndex = timetableIndex + 1;
            nextState.sectionsCheckState = this._getSectionsCheckStateWithState(nextState);
        }

        return nextState;
    }

    _getSectionsCheckStateWithState(state) {
        if (Number.isInteger(state.timetableIndex) && this.props.isViewingTimetablesWithOptions) {
            let timetable = this.props.timetables[state.timetableIndex];
            return TimetableViewer._getSectionCheckState(timetable);
        }
    }

    _getTimetableToShow() {
        let props = this.props;
        let state = this.state;
        console.log(state);
        if (!props.isViewingTimetablesWithOptions || state.hideSectionsFromSelectedCategories) {
            return props.timetables[state.timetableIndex];
        }
        else if (!state.hideSectionsFromSelectedCategories) {
            let timetable = props.timetables[state.timetableIndex];
            if (!state.hideSectionsFromSelectedCategories) {
                return timetable.getTimetableWithSectionCombination(
                    this._getOptionsToShowWithState()[state.sectionCombinationIndex]
                );
            } else {
                return timetable;
            }
        }
    }

    _getTimetableWithState(state) {
        let timetables = this.props.timetables; 
        return state ? timetables[state.timetableIndex] : timetables[this.state.timetableIndex];
    }

    _getNumberOfOptionsToShowWithState(state) {
        return state ? this._getOptionsToShowWithState(state).length : this._getOptionsToShowWithState().length;
    }

    _getOptionsToShowWithState(state) {
        let stateInFunc = state ? state : this.state;
        let checkState = stateInFunc.sectionsCheckState;
        let sectionNames = checkState.map(({value}) => value);
        let checkList = checkState.map(({checked}) => checked);
        let timetable = this.props.timetables[stateInFunc.timetableIndex];
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
        return state ? this._getOptionsToShowWithState(state)[state.sectionCombinationIndex] :
        this._getOptionsToShowWithState()[this.state.sectionCombinationIndex];
    }

    _getAlternativeCombinationsInCurrentTimetable() {
        return this._getTimetableWithState()
        .getAlternativeSectionCombinations();
    }
}

export default TimetableViewer;