export class Sound {
  public context: AudioContext;
  public pan_node: StereoPannerNode;
  public gain_node: GainNode;

  constructor() {
    window.AudioContext = window.AudioContext;
    this.context = new AudioContext();
    this.pan_node = new StereoPannerNode(this.context, { pan: 0 });
    this.gain_node = this.context.createGain();
  }
}

export function loadSound(
  url: string,
  callback: (buffer: AudioBuffer) => void,
  sound: Sound
) {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  // Decode asynchronously
  request.onload = function () {
    sound.context.decodeAudioData(request.response, callback, (e) =>
      console.log(e)
    );
  };
  request.send();
}

export function playSound(buffer: AudioBuffer, sound: Sound) {
  const source = sound.context.createBufferSource(); // creates a sound source
  source.buffer = buffer; // tell the source which sound to play
  source
    .connect(sound.pan_node)
    .connect(sound.gain_node)
    .connect(sound.context.destination); // connect the source to the context's destination (the speakers)
  source.start(0); // play the source now
}
