function getUpdatedStateOnSelectChange(category, checkList, atLeastOneMustBeSelected) {
    let copy = checkList.map((element) => {
        return Object.assign({}, element);
    });
    for (let element of copy) {
        if (element.value === category) {
            if ((!atLeastOneMustBeSelected || !_onlyOneChecked(copy)) || 
            !element.checked) {
                element.checked = !element.checked;
            }
            break;
        }
    }
    return copy;
}

function _onlyOneChecked(checkList) {
    let numChecked = checkList.reduce((accumulator, {checked}) => accumulator + checked, 0);
    return (numChecked === 1);
}


export {getUpdatedStateOnSelectChange}