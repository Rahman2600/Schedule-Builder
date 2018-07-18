import Timetable from './timetable';
import _ from 'lodash';

//allows you to switch between alternatives
export default class TimetableWithOptions extends Timetable {
    constructor(staticSections, alternativeSectionCombination) {
        super(staticSections);
        this.alternativeSections = [];
        this.alternatives = new Map();
        for (let combination of alternativeSectionCombination) {
            this._addAlternativeSectionCombination(combination);
        }
    }

    getAlternativeSectionCombinations() {
        return Array.from(this.alternatives.keys());
    }

    getAlternativeSections() {
        return this.alternativeSections;
    }

    numberOfAlternativeSections() {
        return this.alternativeSections.length;
    }

    getTimetableWithSectionCombination(sectionCombination) {
        let sections = this.sections.concat(Array.from(this.alternatives.get(sectionCombination)));
        let timetable = new Timetable(sections);
        return timetable;
    }

    getAllTables() {
        let timetables = [];
        for (let alternative of this.alternatives.keys()) {
            let timetable = Object.assign({}, this);
            timetable.chooseAlternative(alternative);
            timetables.push(timetable);
        }
    }

    _addAlternativeSectionCombination(combination) {
        let sectionNames = combination.map(({name}) => name)
        for (let name of sectionNames) {
            if (!this.alternativeSections.includes(name)) {
                this.alternativeSections.push(name);
            }
        }
        this.alternatives.set(sectionNames.join(), combination)
    }
}