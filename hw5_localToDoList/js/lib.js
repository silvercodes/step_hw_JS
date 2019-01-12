;
'use strict';

//region class Entry
function Entry({text, isActive, elem}) {
    this.id = this.getId();
    this.text = text;
    this.elem = elem && !isEmpty(elem) ? elem : this.createEntryElement();
    //this.isActive = isActive === undefined ? true : isActive;
    this.isActive = this.isActiveAnalisys(isActive);
}

Entry.prototype.maxId = 0;

Entry.prototype.getId = function() {
    return `entry_${Entry.prototype.maxId++}`;
};

Entry.prototype.createEntryElement = function() {
    const element = document.createElement('div');
    element.classList.add('custom-control');
    element.classList.add('custom-checkbox');

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', this.id);
    checkbox.obj = this;
    checkbox.classList.add('custom-control-input');

    checkbox.addEventListener('click', () => {
        if(checkbox.checked)
            this.deactivate();
        else
            this.activate();
    });

    const label = document.createElement('label');
    label.setAttribute('for', this.id);
    label.classList.add('custom-control-label');
    label.innerHTML = this.text;

    element.appendChild(checkbox);
    element.appendChild(label);

    return element;
};

Entry.prototype.activate = function() {
    this.isActive = true;
    this.elem.childNodes[1].classList.remove('crossed');
};

Entry.prototype.deactivate = function() {
    this.isActive = false;
    this.elem.childNodes[1].classList.add('crossed');
    this.elem.childNodes[0].checked = true;
};

Entry.prototype.isActiveAnalisys = function(isAct) {
    if(isAct === undefined) {
        this.activate();
        return true;
    }
    else {
        if(isAct){
            this.activate();
            return true;
        }
        else {
            this.deactivate();
            return false;
        }
    }
};
//endregion

//region class List
function List({id, name, isSelected, entryCollection, elem, ownerBook}) {
    this.id = this.getId();
    this.name = name;
    this.isSelected = isSelected ? isSelected : false;
    this.entryCollection = entryCollection ? entryCollection : [];
    this.elem = elem ? elem : this.createListElement();
    this.ownerBook = ownerBook;
}

List.prototype.maxId = 0;

List.prototype.getId = function() {
    return `list_${List.prototype.maxId++}`;
};

List.prototype.createListElement = function() {
    let element = document.createElement('a');

    element.classList.add('list-group-item');
    element.classList.add('list-group-item-action');
    element.setAttribute('href', '#');
    element.setAttribute('id', this.id);
    element.innerHTML = this.name;

    element.addEventListener('click', () => {
        this.selectItem();
    });

    return element;
};

List.prototype.selectItem = function() {
    this.ownerBook.listCollection.forEach((list) => {
        list.deselectItem();
    });
    this.isSelected = true;
    this.elem.classList.add('active');
    this.showAllEntries();
};

List.prototype.deselectItem = function() {
    this.isSelected = false;
    this.elem.classList.remove('active');
};

List.prototype.export = function() {
    this.ownerBook = undefined;
    localStorage.setItem(this.name, JSON.stringify(this));
};

List.prototype.import = function() {
    const json = JSON.parse(localStorage.getItem(this.name));

    this.isSelected = json.isSelected;

    json.entryCollection.forEach((entryJson) => {
        this.entryCollection.push(new Entry(entryJson));
    });
};

List.prototype.showAllEntries = function() {
    const field = document.getElementById('field');
    while(field.firstChild) {
        field.removeChild(field.firstChild);
    }
    this.entryCollection.forEach((entry) => {
        field.appendChild(entry.elem);
    });
};

List.prototype.clear = function() {
    this.entryCollection.splice(0, this.entryCollection.length);
    this.showAllEntries();
};

List.prototype.getInactiveCount = function() {
    let count = 0;
    this.entryCollection.forEach((entry) => {
        if(!entry.isActive)
            count++;
    });

    return count;
};

List.prototype.removeInactive = function() {
    let indexToRemove;
    while((indexToRemove = this.entryCollection.findIndex(entry => entry.isActive === false)) > -1) {
        this.entryCollection.splice(indexToRemove, 1);
    }
    this.showAllEntries();
};
//endregion

//region class Book
function Book({listCollection}) {
    this.listCollection = listCollection && !isEmpty(listCollection) ? listCollection : [];
}

Book.prototype.export = function() {
    const listNames = [];
    this.listCollection.forEach((list) => {
        listNames.push(list.name);
        list.export();
    });
    localStorage.setItem('listNames', JSON.stringify(listNames));
};

Book.prototype.import = function() {
    const listNames = JSON.parse(localStorage.getItem('listNames'));
    listNames.forEach((listName) => {
        let list = new List({
            name: listName,
            ownerBook: this
        });
        list.import();
        if(this.listCollection.length === 0)
            list.selectItem();
        this.listCollection.push(list);
    });

};

Book.prototype.show = function() {
    const menuDiv = document.getElementById('menu');
    while(menuDiv.firstChild) {
        menuDiv.removeChild(menuDiv.firstChild);
    }
    this.listCollection.forEach((list, index) => {
        menuDiv.appendChild(list.elem);
    });
};

Book.prototype.getActiveList = function() {
    let activeList = null;
    this.listCollection.forEach((list) => {
        if(list.isSelected)
            activeList = list;
    });
    return activeList;
};

Book.prototype.deleteList = function(id) {
    let indexToRemove = this.listCollection.findIndex(list => list.id === id);
    this.listCollection.splice(indexToRemove, 1);
    this.show();
};
//endregion

//=======================================================================================
/**
 * Check whether an object is empty
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}