import { IntervalDriver } from "./AnimationIntervalDriver";
import { GameAnimation } from "./GameAnimation";

export enum CompositeAnimationType {
    SERIAL = "SERIAL",
    PARALLEL = "PARALLEL",
}

export interface CompositeAnimationParams {
    animations: Array<GameAnimation | CompositeAnimation>;
    type: CompositeAnimationType;
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
    }

    public driven(gameTime: boolean): CompositeAnimation {
        this.driver = new IntervalDriver(gameTime);
        return this;
    }

    public looping(): CompositeAnimation {
        this.loop = true;
        return this;
    }

    public whenDone(onFinish: () => void): CompositeAnimation {
        this.onFinish = onFinish;
        return this;
    }

    public start(): CompositeAnimation {
        this.playing = true;
        this.startAnimations();
        if (this.driver) {
            this.driver.drive(() => this.tick());
        }
        return this;
    }

    public startAnimations() {
        this.animations.forEach((animation) => animation.stop());
        switch (this.type) {
            case CompositeAnimationType.PARALLEL:
                this.animations.forEach((animation, index) => {
                    this.animationMap[index] = false;
                    animation
                        .start()
                        .whenDone(() => this.onAnimationComplete(index));
                });
                break;
            case CompositeAnimationType.SERIAL:
                this.animations[0]
                    .start()
                    .whenDone(() => this.onAnimationComplete(0));
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
                    }
                    this.onFinish && this.onFinish();
                }
                break;

            case CompositeAnimationType.SERIAL:
                if (animationId === this.animations.length - 1) {
                    if (this.loop) {
                        this.startAnimations();
                    }
                    this.onFinish && this.onFinish();
                } else {
                    this.animations[animationId + 1]
                        .start()
                        .whenDone(() =>
                            this.onAnimationComplete(animationId + 1)
                        );
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
