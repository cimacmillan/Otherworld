export class ConsistentArray<T> {
    private array: T[];
    private toAdd: T[];
    private toRemove: T[];

    public constructor() {
        this.array = [];
        this.toAdd = [];
        this.toRemove = [];
    }

    public getArray() {
        return this.array;
    }

    public getToAdd() {
        return this.toAdd;
    }

    public getToRemove() {
        return this.toRemove;
    }

    public add(element: T) {
        this.toAdd.push(element);
    }

    public remove(element: T) {
        this.toRemove.push(element);
    }

    public sync() {
        this.array.push(...this.toAdd);
        this.toRemove.forEach((element: T) => {
            const index = this.array.indexOf(element);
            if (index < 0) {
                return;
            }
            this.array.splice(index, 1);
        });
        this.toAdd = [];
        this.toRemove = [];
    }
}
