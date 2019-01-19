; 'use strict';

document.addEventListener('DOMContentLoaded', init, false);


function init() {
    let comp = new Company();
    comp.genRandomCollection(10);
    comp.show();

    updateButtons(comp);

    document.getElementById('table_body').addEventListener('click', (e) => {
        let row = e.target.parentNode;
        if(row.tagName === 'TR') {
            comp.selectEmployee(row.id);

            updateButtons(comp);
        }
    });

    document.getElementById('btnSave').addEventListener('click', () => {
        if(comp.currentEmployee) {
            comp.updateCurrentEmployee();
        }
        else {
            comp.addNewEmployee();

            updateButtons(comp);
        }
    });

    document.getElementById('btnDelete').addEventListener('click', () => {
        if(comp.currentEmployee) {
            if(confirm(`Are you sure to delete ${comp.currentEmployee.firstName} ${comp.currentEmployee.lastName}?`)) {
                comp.deleteCurrentEmployee();
                clearForm();

                updateButtons(comp);
            }
        }
    });

    document.getElementById('btnNew').addEventListener('click', () => {
        comp.currentEmployee = null;

        clearForm();
        document.querySelector('#btnSave').disabled = false;
    });
}

function clearForm() {
    let inputs = document.querySelectorAll('input, select');
    inputs.forEach((item) => {
        if(item.tagName === 'INPUT' || item.tagName === 'SELECT') {
            item.value = '';
        }
    });
}

function updateButtons(comp) {
    const btnSave = document.querySelector('#btnSave');
    const btnDelete = document.querySelector('#btnDelete');

    if(comp.currentEmployee) {
        btnSave.disabled = false;
        btnDelete.disabled = false;
    }
    else {
        btnSave.disabled = true;
        btnDelete.disabled = true;
    }
}