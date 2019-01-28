;
'use strict';

/**
 * Main Book with current lists
 * @type {Book}
 */
const bookMain = new Book({});

$(document).ready(init);
//document.addEventListener('DOMContentLoaded', init, false);

/**
 * Initialize function
 */
function init() {
    $('#btnNewList').bind('click', addList);
    $('#btnAddEntry').bind('click', addEntry);
    $('#btnClearAll').bind('click', clearList);
    $('#btnDeleteList').bind('click', deleteList);
    $('#btnRemoveCompleted').bind('click', removeCompleted);
    $('#btnSave').bind('click', saveToLocalStorage);

    initialFillStorage();
    bookMain.import();
    bookMain.show();
}

/**
 * First initialize Local Storage
 */
function initialFillStorage() {
    if(!localStorage.getItem('listNames')) {
        const book = new Book ({
            listCollection: [
                new List(
                    {
                        name: 'demo',
                        entryCollection:
                            [
                                new Entry({text: 'text1'}),
                                new Entry({text: 'text2'}),
                                new Entry({text: 'text3'}),
                                new Entry({text: 'text4'}),
                                new Entry({text: 'text5'}),
                            ]
                    }
                ),
                new List(
                    {
                        name: 'demo2',
                        entryCollection:
                            [
                                new Entry({text: 'text11'}),
                                new Entry({text: 'text12'}),
                            ]
                    }
                )
            ]
        });

        book.export();
    }
}

/**
 * Add new list to book
 */
function addList() {
    let listName = prompt('Please enter List name');
    if(listName !== null) {
        let list = new List({
            name: listName,
            ownerBook: bookMain
        });
        list.selectItem();

        bookMain.listCollection.push(list);
        bookMain.show();
    }
}

/**
 * Delete all entries from active list
 */
function clearList() {
    const activeList = bookMain.getActiveList();
    if(activeList
        && activeList.entryCollection.length > 0) {
        if(confirm(`Are you sure you want to clear List "${activeList.name}?"`)) {
            activeList.clear();
        }
    }
}

/**
 * Delete active list
 */
function deleteList() {
    const activeList = bookMain.getActiveList();
    if(activeList) {
        if(confirm(`Are you sure you want to delete List "${activeList.name}?"`)) {
            bookMain.deleteList(activeList.id);
        }

    }
}

/**
 * Delete all completed entries from active list
 */
function removeCompleted() {
    const activeList = bookMain.getActiveList();
    if(activeList
        && activeList.entryCollection.length > 0
        && activeList.getInactiveCount() > 0) {
        if(confirm(`Are you sure you want to remove inactive entries in List "${activeList.name}?"`)) {
            activeList.removeInactive();
        }

    }
}

/**
 * Add new entry
 */
function addEntry() {
    const activeList = bookMain.getActiveList();
    let text = prompt(`Enter the entry for list ${activeList.name}`);
    if(text.length > 0) {
        activeList.entryCollection.push(new Entry({text}));
        activeList.showAllEntries();
    }
}

/**
 * Save current book to Local Storage
 */
function saveToLocalStorage() {
    bookMain.export();
    location.reload();
    alert('Your list are saved to Local Storage');
}