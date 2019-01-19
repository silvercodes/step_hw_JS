; 'use strict';

let currentId = 0;

class Man {
    constructor(fName, lName, age) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
    }
}

class Employee extends Man{
    constructor(fName, lName, age, salary, speciality) {
        super(fName, lName, age);

        this.id = Employee.genId();
        this.salary = salary;
        this.speciality = speciality;
    }

    static genId () {
        return `emp_${currentId++}`;
    }

    show() {
        document.getElementById('first_name').value = this.firstName;
        document.getElementById('last_name').value = this.lastName;
        document.getElementById('age').value = this.age;
        document.getElementById('salary').value = this.salary;
        document.getElementById('speciality').value = this.speciality;
    }
}


class Company {
    constructor() {
        this.empCollection = [];
        this.currentEmployee = null;
    }

    genRandomCollection(count = 10) {
        const rData = getRandomData();
        while(this.empCollection.length < count) {
            let emp = new Employee(
                rData.fNames[rand(0, rData.fNames.length)],
                rData.lNames[rand(0, rData.lNames.length)],
                rand(18, 70),
                rand(6000, 18000),
                rData.specialities[rand(0, rData.specialities.length)]
            );
            this.empCollection.push(emp);
        }
    }

    show() {
        const table = document.getElementById('table_body');

        while(table.firstChild) {
            table.removeChild(table.firstChild);
        }

        for(let key in this.empCollection) {
            let tr = createHTMLElement({tag: 'tr', classList: 'table-primary', id: this.empCollection[key].id});

            let tdFName = createHTMLElement({tag: 'td', inner: this.empCollection[key].firstName});

            let tdLName = createHTMLElement({tag: 'td', inner: this.empCollection[key].lastName});

            let tdSalary = createHTMLElement({tag: 'td', inner: this.empCollection[key].salary});

            tr.appendChild(tdFName);
            tr.appendChild(tdLName);
            tr.appendChild(tdSalary);

            table.appendChild(tr);
        }
    }

    getEmployee(id) {
        return this.empCollection.find(emp => emp.id === id);
    }

    selectEmployee(id) {
        this.currentEmployee = this.getEmployee(id);
        this.currentEmployee.show();
    }

    updateCurrentEmployee() {
        if(this.currentEmployee) {

            this.currentEmployee.firstName = document.getElementById('first_name').value;
            this.currentEmployee.lastName = document.getElementById('last_name').value;
            this.currentEmployee.age = document.getElementById('age').value;
            this.currentEmployee.salary = document.getElementById('salary').value;
            this.currentEmployee.speciality = document.getElementById('speciality').value;

            this.show();
        }
    }

    deleteCurrentEmployee() {
        if(this.currentEmployee) {
            const index = this.empCollection.indexOf(this.currentEmployee);
            this.empCollection.splice(index, 1);

            this.currentEmployee = null;

            this.show();
        }
    }

    addNewEmployee() {
        let newEmployee = new Employee(
            document.getElementById('first_name').value,
            document.getElementById('last_name').value,
            document.getElementById('age').value,
            document.getElementById('salary').value,
            document.getElementById('speciality').value
        );

        this.empCollection.push(newEmployee);

        this.currentEmployee = newEmployee;

        this.show();
    }
}


//--------------------------
function rand(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function createHTMLElement(params) {
    let {tag, classList, id, inner} = params;

    let elem = document.createElement(tag);

    if(id) elem.id = id;
    if(classList) elem.classList.add(classList);
    if(inner) elem.innerHTML = inner;

    return elem;
}