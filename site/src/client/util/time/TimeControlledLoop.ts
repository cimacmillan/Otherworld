
export type TimeControlledLoopCallback = (instance?: TimeControlledLoop, actualMilliseconds?: number, actualProportion?: number) => void;

export class TimeControlledLoop {

    private targetMilliseconds: number;
    private callback: TimeControlledLoopCallback;

    private startMilliseconds: number;
    private endMilliseconds: number;
    private looping: boolean;

    private actualMilliseconds: number;
    private actualProportion: number;

    public constructor(targetMilliseconds: number, callback: TimeControlledLoopCallback) {
        this.targetMilliseconds = targetMilliseconds;
        this.callback = callback;
        this.actualMilliseconds = targetMilliseconds;
        this.actualProportion = 1;
    }

    public start() {
        this.looping = true;
        this.loop();
    }

    public stop() {
        this.looping = false;
    }

    private loop() {
        this.startMilliseconds = Date.now();
        this.callback(this, this.actualMilliseconds, this.actualProportion);
        this.endMilliseconds = Date.now();
        const diff = this.endMilliseconds - this.startMilliseconds;
        let wait = this.targetMilliseconds - diff;
        wait = wait >= 0 ? wait : 0;

        if (wait > 0) {
            this.actualMilliseconds = this.targetMilliseconds;
            this.actualProportion = 1;
        } else {
            this.actualMilliseconds = diff;
            this.actualProportion = this.targetMilliseconds / diff;
        }

        if (this.looping) {
            setTimeout(() => this.loop(), 1);
        }
    }

}
