
const Person = require("./Person");

class Employee extends Person {

    constructor(id, username, password, firstName, lastName, phone, email, employeeNumber, position) {
        super(id, username, password, firstName, lastName, phone, email);
        this.employeeNumber = employeeNumber;
        this.position = position;
    }

}


module.exports = Employee;



