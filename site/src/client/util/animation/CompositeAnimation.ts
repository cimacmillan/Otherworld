import { GameAnimation, StartParameters } from "./Animation";
import { IntervalDriver } from "./AnimationIntervalDriver";

export enum CompositeAnimationType {
    SERIAL = "SERIAL",
    PARALLEL = "PARALLEL",
}

export interface CompositeAnimationParams {
    animations: Array<GameAnimation | CompositeAnimation>;
    type: CompositeAnimationType;
    driver?: IntervalDriver;
}

export class CompositeAnimation {
    private animations: Array<GameAnimation | CompositeAnimation>;
    private type: CompositeAnimationType;
    private driver?: IntervalDriver;
    private onFinish?: () => void;
    private loop?: boolean;
    private playing: boolean;

    private animationMap: { [key: string]: boolean } = {};

    public constructor(params: CompositeAnimationParams) {
        this.animations = params.animations;
        this.type = params.type;
        this.driver = params.driver;
    }

    public start(params: StartParameters) {
        const { loop, onFinish } = params;
        this.onFinish = onFinish;
        this.loop = loop;
        this.playing = true;
        this.startAnimations();
        if (this.driver) {
            this.driver.drive(() => this.tick());
        }
    }

    public startAnimations() {
        this.animations.forEach((animation) => animation.stop());
        switch (this.type) {
            case CompositeAnimationType.PARALLEL:
                this.animations.forEach((animation, index) => {
                    this.animationMap[index] = false;
                    animation.start({
                        onFinish: () => this.onAnimationComplete(index),
                    });
                });
                break;
            case CompositeAnimationType.SERIAL:
                this.animations[0].start({
                    onFinish: () => this.onAnimationComplete(0),
                });
                break;
        }
    }

    public onAnimationComplete(animationId: number) {
        switch (this.type) {
            case CompositeAnimationType.PARALLEL:
                this.animationMap[animationId] = true;
                const finishedCount = Object.keys(this.animationMap).filter(
                    (key) => this.animationMap[key]
                ).length;
                if (finishedCount >= this.animations.length) {
                    if (this.loop) {
                        this.startAnimations();
                    } else {
                        this.onFinish && this.onFinish();
                    }
                }
                break;

            case CompositeAnimationType.SERIAL:
                if (animationId === this.animations.length - 1) {
                    if (this.loop) {
                        this.startAnimations();
                    } else {
                        this.onFinish && this.onFinish();
                    }
                } else {
                    this.animations[animationId + 1].start({
                        onFinish: () =>
                            this.onAnimationComplete(animationId + 1),
                    });
                }
                break;
        }
    }

    public pause() {
        this.playing = false;
        if (this.driver) {
            this.driver.undrive();
        }
    }

    public stop() {
        this.playing = false;
        if (this.driver) {
            this.driver.undrive();
        }
    }

    public tick() {
        if (!this.playing) {
            return;
        }

        this.animations.forEach((animation) => animation.tick());
    }

    public isPlaying() {
        return this.isPlaying;
    }
}
