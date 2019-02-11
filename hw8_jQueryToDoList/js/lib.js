;
'use strict';

class Entry {
    constructor({text, isActive, elem}) {
        this.id = Entry.getId();
        this.text = text;
        this.elem = elem && !isEmpty(elem) ? elem : this.createEntryElement();
        this.isActive = this.isActiveAnalisys(isActive);
    }

    static getId() {
        return `entry_${Entry.maxId++}`;
    }

    createEntryElement() {
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
    }

    activate() {
        this.isActive = true;
        this.elem.childNodes[1].classList.remove('crossed');
    }

    deactivate() {
        this.isActive = false;
        this.elem.childNodes[1].classList.add('crossed');
        this.elem.childNodes[0].checked = true;
    }

    isActiveAnalisys(isAct) {
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
    }
}
Entry.maxId = 0;

class List {
    constructor({id, name, isSelected, entryCollection, elem, ownerBook}) {
        this.id = List.getId();
        this.name = name;
        this.isSelected = isSelected ? isSelected : false;
        this.entryCollection = entryCollection ? entryCollection : [];
        this.elem = elem ? elem : this.createListElement();
        this.ownerBook = ownerBook;
    }

    static getId() {
        return `list_${List.maxId++}`;
    }

    createListElement() {
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
    }

    selectItem() {
        this.ownerBook.listCollection.forEach((list) => {
            list.deselectItem();
        });
        this.isSelected = true;
        this.elem.classList.add('active');
        this.showAllEntries();
    }

    deselectItem() {
        this.isSelected = false;
        this.elem.classList.remove('active');
    }

    export() {
        this.ownerBook = undefined;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    import() {
        const json = JSON.parse(localStorage.getItem(this.name));

        this.isSelected = json.isSelected;

        json.entryCollection.forEach((entryJson) => {
            this.entryCollection.push(new Entry(entryJson));
        });
    }

    showAllEntries() {
        const field = document.getElementById('field');
        while(field.firstChild) {
            field.removeChild(field.firstChild);
        }
        this.entryCollection.forEach((entry) => {
            field.appendChild(entry.elem);
        });
    }

    clear() {
        this.entryCollection.splice(0, this.entryCollection.length);
        this.showAllEntries();
    }

    getInactiveCount() {
        let count = 0;
        this.entryCollection.forEach((entry) => {
            if(!entry.isActive)
                count++;
        });

        return count;
    }

    removeInactive() {
        let indexToRemove;
        while((indexToRemove = this.entryCollection.findIndex(entry => entry.isActive === false)) > -1) {
            this.entryCollection.splice(indexToRemove, 1);
        }
        this.showAllEntries();
    }
}
List.maxId = 0;


class Book {
    constructor({listCollection}) {
        this.listCollection = listCollection && !isEmpty(listCollection) ? listCollection : [];
    }

    export() {
        const listNames = [];
        this.listCollection.forEach((list) => {
            listNames.push(list.name);
            list.export();
        });
        localStorage.setItem('listNames', JSON.stringify(listNames));
    }

    import() {
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
    }

    show() {
        const menuDiv = document.getElementById('menu');
        while(menuDiv.firstChild) {
            menuDiv.removeChild(menuDiv.firstChild);
        }
        this.listCollection.forEach((list, index) => {
            menuDiv.appendChild(list.elem);
        });
    }

    getActiveList() {
        let activeList = null;
        this.listCollection.forEach((list) => {
            if(list.isSelected)
                activeList = list;
        });
        return activeList;
    }

    deleteList(id) {
        let indexToRemove = this.listCollection.findIndex(list => list.id === id);
        this.listCollection.splice(indexToRemove, 1);
        this.show();
    }
}

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