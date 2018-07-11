import TimeInterval from "./time_interval";

// list of time intervals stored as an augumented doubly-linked list

const SETINEL_NAME = ''; //key used to identify an empty interval

export default class Timeline {
    constructor(start, end) {
        this.start = new Node(SETINEL_NAME, start);
        this.end = new Node(null, end);
        this.start.right = this.end;
        this.end.left = this.start;
    }

    addInterval({key, interval}) {
        let nodeToInsert = this.getMaxPossibleNode(interval.start);
        let intervalRep = nodeToInsert.toInterval();
        if (intervalRep.equals(interval)) {
            nodeToInsert.key = key;
        } else if (intervalRep.startAtSameTime(interval)) {
            nodeToInsert.partition(interval.end, key, true);
        } else if (intervalRep.endAtSameTime(interval)) {
            nodeToInsert.partition(interval.start, key, false);
        } else { //interval is in the middie of interval we want to insert it
            nodeToInsert.partition(interval.start, key, false);
            nodeToInsert.right.partition(interval.end, key, true);
        }
    }

    removeInterval(key) {
        let nodeToRemove = this.getNodeWithKey(key);
        if (nodeToRemove != null) {
            nodeToRemove.key = SETINEL_NAME;
            let leftIsSetinel = nodeToRemove.left && nodeToRemove.left.isSetinel();
            let rightIsSetinel = nodeToRemove.right && nodeToRemove.right.isSetinel();
            if (leftIsSetinel && rightIsSetinel) {
                let newNode = nodeToRemove.mergeLeft();
                newNode.mergeRight();
            } else if (leftIsSetinel) {
                nodeToRemove.mergeLeft();
            } else if (rightIsSetinel) {
                nodeToRemove.mergeRight();
            }
        }
    }

    getAllKeyValuePairs() {
        let pairs = [];
        let current = this.start;
        while(current != this.end) {
            pairs.push({name: current.key, 
                interval: current.toInterval()});
            current = current.right;
        }
        return pairs;
    }

    //get node with maximum time less than or equal to time
    getMaxPossibleNode(time) {
        let current = this.start;
        //there is always a highest timeline less than
        while(true) {
            let value = current.right.time.compareTo(time);
            if (value === 0) {
                return current.right;
            } else if (value < 0) {
                current = current.right;
            } else {
                return current;
            }
        }
    } 
    
    getNodeWithKey(key) {
        let current = this.start;
        while(current) {
            if (current.key === key) {
                return current;
            } 
            current = current.right;
        }
    }
}

class Node {
    constructor(key, time) {
        this.key = key;
        this.time = time;
    }

    //interval this node represents
    toInterval() {
        return new TimeInterval(this.time, this.right.time);
    }

    /* partition this interval into two intervals 
    if insertLeft is true puts the key in the left interval
    else puts it in the right interval */
    partition(time, key, insertLeft) {
        this.key = insertLeft ? key : SETINEL_NAME;
        let rightKey = insertLeft ? SETINEL_NAME : key;
        let prevRight = this.right;
        this.right = new Node(rightKey, time);
        this.right.left = this;
        this.right.right = prevRight;
        prevRight.left = this.right;
    }

    //combines node with node to left or to right as indicated by the to left parameter
    //returns reference to new node
    mergeLeft() {
        this.left.right = this.right;
        this.right.left = this.left;
        return this.left;
    }
    
    mergeRight() {
        this.right = this.right.right;
        this.right.left = this;
        return this.right;
    }

    isSetinel() {
        return this.key === SETINEL_NAME;
    }
}
