import { TARGET_FPS } from "../../Config";
import { identity, TweenFunction } from "./TweenFunction";

export type AnimationDriverCallback = (x: number) => void;

const RESOLUTION = Math.floor(1000 / TARGET_FPS);

export class AnimationDriver {
    private tweenFunction = identity;
    private speedMilliseconds: number = 1000;
    private loop: boolean = false;
    private currentPosition: number = 0;
    private playCount = 0;
    private onFinish: () => void;
    private playing: boolean = false;

    public constructor(private callback: AnimationDriverCallback) {}

    public speed(milliseconds: number): AnimationDriver {
        this.speedMilliseconds = milliseconds;
        return this;
    }

    public tween(tween: TweenFunction): AnimationDriver {
        // this.tweenFunction = (x: number) => tween(this.tweenFunction(x));
        this.tweenFunction = tween;
        return this;
    }

    public start(
        offset?: number,
        loop?: boolean,
        onFinish?: () => void
    ): AnimationDriver {
        if (offset) {
            this.currentPosition = offset;
        } else {
            this.currentPosition = 0;
        }
        this.onFinish = onFinish;
        this.loop = loop;
        this.playing = true;
        return this;
    }

    public pause() {
        this.playing = false;
    }

    public stop() {
        this.playing = false;
        this.currentPosition = 0;
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
            const increment = RESOLUTION / this.speedMilliseconds;
            this.currentPosition += increment;
        }
    }

    public getPlayCount() {
        return this.playCount;
    }

    public isPlaying() {
        return this.isPlaying;
    }
}
