
// Typescript is similar to javascript but with strongly typed arguments
export function sum(a: number, b: number) {
    return a + b;
}

// Interface defines the shape of the input
export interface Person {
    firstName: string,
    lastName: string,
}

// Interface is given as a type to the function arguments, similar to objects
export function printPerson(person: Person) {
    console.log(person.firstName + " " + person.lastName);
}


export class Student {

    fullName: string;

    // Public keyword automatically sets parameters of student class with name of argument
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }

}