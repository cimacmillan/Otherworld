import { TARGET_FPS } from "../../Config";
import { identity, TweenFunction } from "./TweenFunction";

export type AnimationDriverCallback = (x: number) => void;

const RESOLUTION = Math.floor(1000 / TARGET_FPS);

export class AnimationDriver {
  private tweenFunction = identity;
  private speedMilliseconds: number = 1000;
  private loop: boolean = false;
  private currentPosition: number = 0;

  private intervalID: NodeJS.Timeout;

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

  public start(offset?: number, loop?: boolean) {
    if (offset) {
      this.currentPosition = offset;
    }
    this.loop = loop;
    // this.intervalID = setInterval(() => this.onInterval(), RESOLUTION);
  }

  public pause() {
    if (this.intervalID) {
      // clearInterval(this.intervalID);
    }
  }

  public stop() {
    if (this.intervalID) {
      // clearInterval(this.intervalID);
      this.currentPosition = 0;
    }
  }

  public tick() {
    if (this.currentPosition >= 1.0) {
      this.callback(this.tweenFunction(1));
      if (this.loop) {
        this.currentPosition = 0;
      } else {
        this.stop();
      }
    } else {
      this.callback(this.tweenFunction(this.currentPosition));
      const increment = RESOLUTION / this.speedMilliseconds;
      this.currentPosition += increment;
    }
  }
}
