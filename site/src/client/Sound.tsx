
class Sound {
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

function loadSound(url: string, callback: (buffer: AudioBuffer) => void, sound: Sound) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function () {
        sound.context.decodeAudioData(request.response, callback, (e) => console.log(e));
    }
    request.send();
}

function playSound(buffer: AudioBuffer, sound: Sound) {
    var source = sound.context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(sound.pan_node).connect(sound.gain_node).connect(sound.context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
}

