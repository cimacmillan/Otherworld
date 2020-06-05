import { TARGET_FPS } from "../../Config";
import { IntervalDriver } from "./AnimationIntervalDriver";
import { TweenFunction } from "./Animations";

export type AnimationDriverCallback = (x: number) => void;

export interface StartParameters {
    offset?: number;
    loop?: boolean;
    onFinish?: () => void;
}

export const ANIMATION_RESOLUTION = Math.floor(1000 / TARGET_FPS);

export class GameAnimation {
    private speedMilliseconds: number = 1000;
    private loop: boolean = false;
    private currentPosition: number = 0;
    private playCount = 0;
    private onFinish: () => void;
    private playing: boolean = false;
    private driver?: IntervalDriver;

    public constructor(private callback: AnimationDriverCallback) {
        return this;
    }

    public driven(gameTime: boolean): GameAnimation {
        this.driver = new IntervalDriver(gameTime);
        return this;
    }

    public speed(milliseconds?: number): GameAnimation {
        this.speedMilliseconds = milliseconds ? milliseconds : 1000;
        return this;
    }

    public tween(tween: TweenFunction): GameAnimation {
        const currentTweenCopy = this.tweenFunction;
        this.tweenFunction = (x: number) => tween(currentTweenCopy(x));
        return this;
    }

    public looping(): GameAnimation {
        this.loop = true;
        return this;
    }

    public whenDone(onFinish: () => void): GameAnimation {
        this.onFinish = onFinish;
        return this;
    }

    public withOffset(offset: number): GameAnimation {
        this.currentPosition = offset;
        return this;
    }

    public start(): GameAnimation {
        this.playing = true;
        if (this.driver) {
            this.driver.drive(() => this.tick());
        }
        return this;
    }

    public pause() {
        this.playing = false;
        if (this.driver) {
            this.driver.undrive();
        }
    }

    public stop() {
        this.playing = false;
        this.currentPosition = 0;
        if (this.driver) {
            this.driver.undrive();
        }
    }

    public tick() {
        if (!this.playing) {
            return;
        }
        if (this.currentPosition >= 1.0) {
            this.callback(this.tweenFunction(1));
            if (this.loop) {
                this.currentPosition = 0;
            } else {
                this.stop();
            }
            this.playCount++;
            this.onFinish && this.onFinish();
        } else {
            this.callback(this.tweenFunction(this.currentPosition));
            const increment = ANIMATION_RESOLUTION / this.speedMilliseconds;
            this.currentPosition += increment;
        }
    }

    public getCurrentPosition() {
        return this.currentPosition;
    }

    public getPlayCount() {
        return this.playCount;
    }

    public isPlaying() {
        return this.isPlaying;
    }
    private tweenFunction = (x: number) => x;
}
