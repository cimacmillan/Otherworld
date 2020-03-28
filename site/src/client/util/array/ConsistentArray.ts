export class ConsistentArray<T> {
  private array: Array<T>;
  private toAdd: Array<T>;
  private toRemove: Array<T>;

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
      this.array.splice(index, 1);
    });
    this.toAdd = [];
    this.toRemove = [];
  }
}
