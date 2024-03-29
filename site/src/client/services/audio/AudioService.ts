import { vec2 } from "gl-matrix";
import { endsWith } from "lodash";
import { Camera } from "../../types";
import { AudioMetadata, AudioObject } from "./AudioObject";

const MIN_GAIN = 0;
const MAX_GAIN = 1;
const DISTANCE_RUN_OFF = 1;

const MIN_PLAY_BETWEEN = 100;

const FADE_IN_SPEED = 0.02;
const FADE_OUT_SPEED = 0.02;


export class AudioService {
    private camera: () => Camera;
    private currentSong: {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
    } | undefined = undefined;
    private isPaused = false;

    constructor(private context: AudioContext) {
        window.AudioContext = window.AudioContext;
    }

    public attachCamera(camera: () => Camera) {
        this.camera = camera;
    }

    public play(
        audioObject: AudioObject,
        gain: number = 1,
        pan: number = 0,
        onEnded: () => void = () => {}
    ): AudioBufferSourceNode | undefined {
        if (this.canPlay(audioObject)) {
            return playSound(audioObject, this.context, gain, pan, onEnded);
        }
    }

    private fadeOutInterval: any;
    private fadeInInterval: any;
 
    public playSong(
        audioObject: AudioObject,
        gain: number = 1,
        shouldFade: boolean = true
    ) {
        this.fadeOutInterval && clearInterval(this.fadeOutInterval);
        this.fadeInInterval && clearInterval(this.fadeInInterval);
        if (this.currentSong && shouldFade) {
            const targetSong = this.currentSong;
            let fadeOut = targetSong.gainNode.gain.value;
            this.fadeOutInterval = setInterval(() => {
                fadeOut -= FADE_OUT_SPEED;
                if (fadeOut <= 0) {
                    fadeOut = 0;
                    clearInterval(this.fadeOutInterval);
                    targetSong.source.stop();
                }
                targetSong.gainNode.gain.setValueAtTime(fadeOut, this.context.currentTime);
            }, 60);
        } else if (this.currentSong) {
            this.currentSong.source.stop();
        }
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(0, this.context.currentTime);

        let fade = 0;
        if (!this.isPaused) {
            this.fadeInInterval = setInterval(() => {
                fade += FADE_IN_SPEED;
                if (fade >= 1) {
                    fade = 1;
                    clearInterval(this.fadeInInterval);
                }
                gainNode.gain.setValueAtTime(fade * gain, this.context.currentTime);
            }, 60);
        }

        const source = this.context.createBufferSource(); // creates a sound source
        source.buffer = audioObject.buffer; // tell the source which sound to play
        source.connect(gainNode).connect(this.context.destination); // connect the source to the context's destination (the speakers)
        source.start(0); // play the source now
        this.currentSong = {
            source, gainNode
        };
        this.currentSong.source.loop = true;
        return this.currentSong;
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

    public stopSong(){
        if (this.currentSong) {
            this.currentSong.source.stop();
        }
    }

    public isPlayingSong() {
        return this.currentSong;
    }

    public pauseSong() {
        this.isPaused = true;
        if (this.currentSong) {
            this.currentSong.gainNode.gain.setValueAtTime(0, this.context.currentTime);
            this.fadeInInterval && clearInterval(this.fadeInInterval);
        }
    }

    public resumeSong() {
        this.isPaused = false;
        if (this.currentSong) {
            this.currentSong.gainNode.gain.setValueAtTime(1, this.context.currentTime);
        }
    }
}

export function loadSound(
    url: string,
    context: AudioContext,
    metadata?: AudioMetadata
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
                        metadata,
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
    pan: number,
    onEnded: () => void = () => {}
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
    source.addEventListener("ended", onEnded);
    return source;
}
