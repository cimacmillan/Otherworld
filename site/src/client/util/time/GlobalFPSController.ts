export function setFPSProportion(x: number) {
    getInstance().setProportion(x);
}

export function fpsNorm(x: number) {
    return getInstance().norm(x);
}

export function logFPS() {
    getInstance().logFPS();
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

    public logFPS() {
        this.framesSinceLastLog++;  
        const timeSincelastLog = Date.now() - this.previousLogTime;
        if (timeSincelastLog >= 1000) {
            console.log("FPS: ", this.framesSinceLastLog);
            this.framesSinceLastLog = 0;
            this.previousLogTime = Date.now();
        }
    }
}

var fpsInstance: GlobalFPSController;

const getInstance = (): GlobalFPSController => {
    if (!fpsInstance) {
        fpsInstance = new GlobalFPSController();
    } 
    return fpsInstance;
}

