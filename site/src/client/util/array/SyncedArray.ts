export interface ISyncedArrayRef<T> {
	obj: T;
	uniqueId: number;
}

export interface ISyncedArrayCallbacks<T> {
	onUpdate: (array: Array<ISyncedArrayRef<T>>) => void;
	onReconstruct: (array: Array<ISyncedArrayRef<T>>) => void;
	onInjection: (index: number, obj: ISyncedArrayRef<T>) => void;
}

export class SyncedArray<T> {
	private array: Array<ISyncedArrayRef<T>> = [];
	private uniqueId: number = 0;

	private requireConstruction: boolean;
	private requireUpdate: boolean;

	public constructor(private callbacks: ISyncedArrayCallbacks<T>) {}

	public createItem(obj: T): number {
		this.uniqueId++;
		this.array.push({
			obj,
			uniqueId: this.uniqueId,
		});
		this.requireConstruction = true;
		return this.uniqueId;
	}

	public updateItem(ref: number, param: Partial<T>) {
		const index = this.findRealIndexOf(ref);
		if (index >= 0) {
			const ref = this.array[index];
			ref.obj = { ...ref.obj, ...param };
			if (!this.requireConstruction) {
				this.callbacks.onInjection(index, this.array[index]);
				this.requireUpdate = true;
			}
		}
	}

	public freeItem(ref: number) {
		const index = this.findRealIndexOf(ref);
		if (index >= 0) {
			this.requireConstruction = true;
			this.array.splice(index, 1);
		}
	}

	public sync() {
		if (this.requireConstruction) {
			this.callbacks.onReconstruct(this.array);
			this.requireUpdate = false;
			this.requireConstruction = false;
		}

		if (this.requireUpdate) {
			this.callbacks.onUpdate(this.array);
			this.requireUpdate = false;
		}
	}

	public getArray() {
		return this.array;
	}

	private findRealIndexOf(renderId: number) {
		if (this.array.length === 0) {
			return -1;
		}

		let found = false;
		let start = 0;
		let end = this.array.length;
		let midpoint;
		while (found == false) {
			if (start > end) {
				break;
			}
			midpoint = ~~((start + end) / 2);
			const checkId = this.array[midpoint].uniqueId;

			if (checkId === NaN || checkId === Infinity) {
				return -1;
			}

			if (renderId === checkId) {
				found = true;
				break;
			} else if (renderId < checkId) {
				end = midpoint - 1;
			} else if (renderId > checkId) {
				start = midpoint + 1;
			}
		}
		if (found === true) {
			return midpoint;
		}
		return -1;
	}
}
