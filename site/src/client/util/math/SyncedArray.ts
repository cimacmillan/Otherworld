
export interface ISyncedArrayRef<T> {
  obj: T;
  uniqueId: number;
}

type PrivateSyncedArrayRef<T> = ISyncedArrayRef<T> | {
  requireUpdate: boolean;
};

export interface ISyncedArrayCallbacks<T> {
  onSingleItemUpdate: (id: number, obj: T) => void;
  onFullUpdate: (array: Array<ISyncedArrayRef<T>> ) => void;
}

export class SyncedArray<T> {
  private array: Array<PrivateSyncedArrayRef<T>>;
  private requireConstruction: boolean;
  private uniqueId: number;

  public constructor()

  public createItem(obj: T): number {
    this.uniqueId++;
    this.array.push({
      obj,
      uniqueId: this.uniqueId,
      requireUpdate: false
    });
    this.requireConstruction = true;
    return this.uniqueId;
  }

  public updateItem(ref: RenderItem, param: Partial<Sprite>) {
    const index = this.findRealIndexOf(ref.renderId);
    if (index >= 0) {
      
        this.requireUpdate = true;
    }
  }

  public freeItem(ref: RenderItem) {
    const index = this.findRealIndexOf(ref.renderId);
    if (index >= 0) {
        this.requireConstruction = true;
        this.spriteArray.splice(index, 1);
    }
  }



}
