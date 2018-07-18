import React, { Component } from 'react';

import Timetable from './timetable_component';
import Dropdown from './dropdown';
import { CheckList, getUpdatedStateOnSelectChange } from './check_list';
import { isNumber } from 'util';

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
        this._getNumberOfAlternativeSectionCombinations = this._getNumberOfAlternativeSectionCombinations.bind(this);
        this._getSelectedSectionCombination = this._getSelectedSectionCombination.bind(this);
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

    render() {
        let isViewingTimetablesWithOptions = this.props.isViewingTimetablesWithOptions;
        if (isViewingTimetablesWithOptions) {
            let checkState = this.state.sectionsCheckState;
            let sectionNames = checkState.map(({value}) => value);
            let checkList = checkState.map(({checked}) => checked);
            let unfiltered = this.props.timetables[this.state.currentTimetableIndex]
            .getAlternativeSectionCombinations();
            var options = unfiltered.filter((combination) => {
                let sections = combination.split(",");
                for (let section of sections) {
                    let index = sectionNames.indexOf(section);
                    if (!checkList[index]) {
                        return false;
                    } 
                }
                return true;
            })
        }
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
                    <Timetable timetable={TimetableViewer._getTimetableToShow(this.props, this.state)} />
                    { this.props.isViewingTimetablesWithOptions ?
                        <div>
                            <Dropdown 
                                selected={this._getSelectedSectionCombination()} 
                                options={options} 
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

    onSectionsSelectedChange(category) {
        this.setState((prevState) => {
            return { sectionsCheckState: 
                getUpdatedStateOnSelectChange(category, prevState.sectionsCheckState)}
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
            let numberOfOptionsInNextState = this.props.timetables[nextState.currentTimetableIndex]
            .numberOfAlternativeSections();
            nextState.currentSectionCombinationIndex = numberOfOptionsInNextState - 1;
        } else if (currentTimetableIndex > 0) {
            nextState.currentTimetableIndex = currentTimetableIndex - 1;
        }

        //TODO: extract to helper
        this._updateStateWithSectionsCheckState(nextState);
        return nextState;
    }

    _getStateUpdatesWithNextClicked({expanded, currentTimetableIndex, 
        currentSectionCombinationIndex}) {
        let nextState = {};
        if (expanded && (currentSectionCombinationIndex < 
            this._getNumberOfAlternativeSectionCombinations() - 1)) {
            nextState.currentSectionCombinationIndex = currentSectionCombinationIndex + 1;
        } else if (expanded) {
            nextState.currentSectionCombinationIndex = 0;
            nextState.currentTimetableIndex = currentTimetableIndex + 1;
        } else if (currentTimetableIndex < this.props.timetables.length - 1) {
            nextState.currentTimetableIndex = currentTimetableIndex + 1;
        }

        //TODO: extract to helper
        this._updateStateWithSectionsCheckState(nextState);
        return nextState;
    }

    static _getTimetableToShow(props, state) {
        if (props.isViewingTimetablesWithOptions) {
            let timetable = props.timetables[state.currentTimetableIndex];
            if (!state.hideSectionsFromSelectedCategories) {
                return timetable.getTimetableWithSectionCombination(
                    timetable.getAlternativeSectionCombinations()[state.currentSectionCombinationIndex]
                );
            } else {
                return timetable;
            }
        }
        else {
            return props.timetables[state.currentTimetableIndex];
        }
    }

    _getSelectedSectionCombination() {
        return this._getAlternativeCombinationsInCurrentTimetable()[this.state.currentSectionCombinationIndex];
    }

    _getNumberOfAlternativeSectionCombinations() {
        return this._getAlternativeCombinationsInCurrentTimetable().length;
    }

    _getAlternativeCombinationsInCurrentTimetable() {
        return this.props.timetables[this.state.currentTimetableIndex].
        getAlternativeSectionCombinations();
    }

    static _getSectionCheckState(timetable) {
        return timetable.getAlternativeSections().map((section) => {
                return {value: section, checked: true};
        });
    }

    _updateStateWithSectionsCheckState(state) {
        if (Number.isInteger(state.currentTimetableIndex) && this.props.isViewingTimetablesWithOptions) {
            let timetable = this.props.timetables[state.currentTimetableIndex];
            state.sectionsCheckState = TimetableViewer._getSectionCheckState(timetable);
        }
    }

}

export default TimetableViewer;