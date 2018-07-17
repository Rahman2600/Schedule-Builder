import Timetable from './timetable_beta';

//allows you to switch between alternatives
export default class TimetableWithOptions extends Timetable {
    constructor(staticSections, alternativeSectionCombination) {
        super(staticSections);
        this.alternatives = new Map();
        for (let combination of alternativeSectionCombination) {
            this._addAlternativeSectionCombination(combination);
        }
    }

    _addAlternativeSectionCombination(combination) {
        let sectionNames = combination.map(({name}) => name)
        this.alternatives.set(sectionNames.join(), combination)
    }

    getAlternativeCombinations() {
        return Array.from(this.alternatives.keys());
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

    
    _addAlternativeEntry(entry) {
        let categoryName = entry.categoryName;
        let name = entry.name;
        let timeslot = entry.timeslot;
        let categoryData = this.alternatives.get(categoryName);
        if (categoryData) {
            let sectionData = categoryData.get(name);
            if (sectionData) {
                sectionData.push(timeslot);
            } else {
                categoryData.set(name, [timeslot]);
            }
        } else {
            let categoryData = new Map();
            categoryData.set(name, [timeslot]);
            this.alternatives.set(categoryName, categoryData);
        }
    }

}