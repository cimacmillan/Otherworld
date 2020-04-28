import { mat4 } from "gl-matrix";

const MIN_MAGNITUDE = 0.0001;
const MAGNITUDE_DECAY = 0.5;
const MAGNITUDE_MULTIPLIER = 0.3;

export class ScreenShakeService {
    private currentMagnitude = 0;

    public update() {
        this.currentMagnitude = this.currentMagnitude * MAGNITUDE_DECAY;
    }

    public shake(magnitudue: number) {
        this.currentMagnitude = magnitudue;
    }

    public applyToMatrices(modelViewMatrix: mat4) {
        if (this.currentMagnitude < MIN_MAGNITUDE) {
            return;
        }

        const mag = this.currentMagnitude * MAGNITUDE_MULTIPLIER;
        const magX = Math.random() * mag;
        const magY = Math.random() * mag;
        const magZ = Math.random() * mag;

        mat4.translate(modelViewMatrix, modelViewMatrix, [magX, magY, magZ]);
    }
}
