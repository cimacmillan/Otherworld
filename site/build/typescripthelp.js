"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Typescript is similar to javascript but with strongly typed arguments
function sum(a, b) {
    return a + b;
}
exports.sum = sum;
// Interface is given as a type to the function arguments, similar to objects
function printPerson(person) {
    console.log(person.firstName + " " + person.lastName);
}
exports.printPerson = printPerson;
class Student {
    // Public keyword automatically sets parameters of student class with name of argument
    constructor(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}
exports.Student = Student;
//# sourceMappingURL=typescripthelp.js.map