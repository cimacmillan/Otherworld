import { vec2 } from "gl-matrix";
import { Camera } from "../../types";
import { AudioObject } from "./AudioObject";

const MIN_GAIN = 0;
const MAX_GAIN = 1;
const DISTANCE_RUN_OFF = 1;

const MIN_PLAY_BETWEEN = 100;

export class AudioService {
    private camera: () => Camera;

    constructor(private context: AudioContext) {
        window.AudioContext = window.AudioContext;
    }

    public attachCamera(camera: () => Camera) {
        this.camera = camera;
    }

    public play(
        audioObject: AudioObject,
        gain: number = 1,
        pan: number = 0
    ): AudioBufferSourceNode | undefined {
        if (this.canPlay(audioObject)) {
            return playSound(audioObject, this.context, gain, pan);
        }
    }

    public play3D(
        audioObject: AudioObject,
        sourcePosition: vec2,
        gain: number = 1
    ): AudioBufferSourceNode | undefined {
        if (!this.camera || !this.canPlay(audioObject)) {
            return;
        }
        const { position, angle } = this.camera();
        const difX = sourcePosition[0] - position.x;
        const difY = sourcePosition[1] - position.y;
        const distance = Math.sqrt(difX * difX + difY * difY);
        const distanceGain = Math.min(
            gain / (distance * DISTANCE_RUN_OFF),
            MAX_GAIN
        );
        const pan = Math.sin(Math.atan2(difX, -difY) - angle);
        return playSound(audioObject, this.context, distanceGain, pan);
    }

    public getContext() {
        return this.context;
    }

    public canPlay(audioObject: AudioObject): boolean {
        if (audioObject.timeSinceLastPlayed === undefined) {
            return true;
        }

        const currentTime = Date.now();
        return (
            currentTime - audioObject.timeSinceLastPlayed >= MIN_PLAY_BETWEEN
        );
    }
}

export function loadSound(
    url: string,
    context: AudioContext
): Promise<AudioObject> {
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(
                request.response,
                (audioBuffer: AudioBuffer) => {
                    resolve({
                        buffer: audioBuffer,
                    });
                },
                (e) => console.log(e)
            );
        };
        request.send();
    });
}

export function playSound(
    audioObject: AudioObject,
    context: AudioContext,
    gain: number,
    pan: number
): AudioBufferSourceNode {
    audioObject.timeSinceLastPlayed = Date.now();

    if (gain < MIN_GAIN) {
        return;
    }

    const panNode = new StereoPannerNode(context, { pan });
    const gainNode = context.createGain();

    gainNode.gain.setValueAtTime(gain, context.currentTime);

    const source = context.createBufferSource(); // creates a sound source
    source.buffer = audioObject.buffer; // tell the source which sound to play
    source.connect(panNode).connect(gainNode).connect(context.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source now
    return source;
}
