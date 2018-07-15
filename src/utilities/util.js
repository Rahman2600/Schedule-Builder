exports._mapToArrayOfObjects = function (map, keyName, valueName) {
    let arrayOfObjects = []; 
    for (let [key, value] of map) {
        let entry = {};
        entry[keyName] = key;
        entry[valueName] = value;
        arrayOfObjects.push(entry);
    }
    return arrayOfObjects;
}

exports.getIndexOfObjectWith = function (array, key, value) {
    let pos;
    for (let i = 0; i < array.length; i++) {
        if (this.array[i][key] === value) {
            pos = i;
        }
    }
    if (!pos) return pos = - 1;
    return pos;
}
