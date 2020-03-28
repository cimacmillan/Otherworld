import { vec2 } from "gl-matrix";
import { Camera } from "../../types";

export class AudioService {
  private camera: Camera;

  constructor(private context: AudioContext) {
    window.AudioContext = window.AudioContext;
  }

  public attachCamera(camera: Camera) {
    this.camera = camera;
  }

  public play(buffer: AudioBuffer, gain: number = 1, pan: number = 0) {
    playSound(buffer, this.context, gain, pan);
  }

  public play3D(buffer: AudioBuffer, sourcePosition: vec2, gain: number = 1) {
    if (!this.camera) {
      return;
    }

    // console.log(`Boing ${this.camera.position} ${sourcePosition} ${gain}`);
    // playSound(buffer, this.context, gain, 1);
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
) {
  const panNode = new StereoPannerNode(context, { pan });
  const gainNode = context.createGain();

  gainNode.gain.setValueAtTime(gain, context.currentTime);

  const source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer; // tell the source which sound to play
  source.connect(panNode).connect(gainNode).connect(context.destination); // connect the source to the context's destination (the speakers)
  source.start(0); // play the source now
}
