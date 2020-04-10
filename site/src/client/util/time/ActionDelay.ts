export class ActionDelay {
    private delay: number;
    private lastTime?: number;
    public constructor(delay: number) {
        this.delay = delay;
    }

    public canAction() {
        if (!this.lastTime) {
            return true;
        }
        const timeSinceLast = Date.now() - this.lastTime;
        return timeSinceLast >= this.delay;
    }

    public onAction() {
        this.lastTime = Date.now();
    }

    public updateDelay(delay: number) {
        this.delay = delay;
    }

    public getProgress() {
        if (!this.lastTime) {
            return 1;
        }
        const timeSinceLast = Date.now() - this.lastTime;
        return Math.min(timeSinceLast / this.delay, 1);
    }
}
