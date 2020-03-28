import { vec2 } from "gl-matrix";
import { Camera } from "../../types";

const MIN_GAIN = 0;
const MAX_GAIN = 1;
const DISTANCE_RUN_OFF = 1;

export class AudioService {
  private camera: Camera;

  constructor(private context: AudioContext) {
    window.AudioContext = window.AudioContext;
  }

  public attachCamera(camera: Camera) {
    this.camera = camera;
  }

  public play(buffer: AudioBuffer, gain: number = 1, pan: number = 0): AudioBufferSourceNode {
    return playSound(buffer, this.context, gain, pan);
  }

  public play3D(buffer: AudioBuffer, sourcePosition: vec2, gain: number = 1): AudioBufferSourceNode {
    if (!this.camera) {
      return;
    }
    const difX = sourcePosition[0] - this.camera.position.x;
    const difY = sourcePosition[1] - this.camera.position.y;
    const distance = Math.sqrt(difX * difX + difY * difY);
    const distanceGain = Math.min(
      gain / (distance * DISTANCE_RUN_OFF),
      MAX_GAIN
    );
    const pan = Math.sin(Math.atan2(difX, -difY) - this.camera.angle);
    return playSound(buffer, this.context, distanceGain, pan);
  }

  public getContext() {
    return this.context;
  }
}

export function loadSound(
  url: string,
  context: AudioContext
): Promise<AudioBuffer> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Decode asynchronously
    request.onload = function () {
      context.decodeAudioData(request.response, resolve, (e) => console.log(e));
    };
    request.send();
  });
}

export function playSound(
  buffer: AudioBuffer,
  context: AudioContext,
  gain: number,
  pan: number
): AudioBufferSourceNode {
  if (gain < MIN_GAIN) return;

  const panNode = new StereoPannerNode(context, { pan });
  const gainNode = context.createGain();

  gainNode.gain.setValueAtTime(gain, context.currentTime);

  const source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer; // tell the source which sound to play
  source.connect(panNode).connect(gainNode).connect(context.destination); // connect the source to the context's destination (the speakers)
  source.start(0); // play the source now
  return source;
}

