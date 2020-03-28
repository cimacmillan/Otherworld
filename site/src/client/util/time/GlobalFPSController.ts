export function setFPSProportion(x: number) {
  getInstance().setProportion(x);
}

export function fpsNorm(x: number) {
  return getInstance().norm(x);
}

export function logFPS(callback: (number: number) => void) {
  getInstance().logFPS(callback);
}

class GlobalFPSController {
  private proportion = 1;
  private framesSinceLastLog = 0;
  private previousLogTime = Date.now();

  public setProportion(x: number) {
    this.proportion = x;
  }

  public norm(x: number) {
    return x * this.proportion;
  }

  public logFPS(callback: (number: number) => void) {
    this.framesSinceLastLog++;
    const timeSincelastLog = Date.now() - this.previousLogTime;
    if (timeSincelastLog >= 1000) {
      callback(this.framesSinceLastLog);
      this.framesSinceLastLog = 0;
      this.previousLogTime = Date.now();
    }
  }
}

let fpsInstance: GlobalFPSController;

const getInstance = (): GlobalFPSController => {
  if (!fpsInstance) {
    fpsInstance = new GlobalFPSController();
  }
  return fpsInstance;
};
