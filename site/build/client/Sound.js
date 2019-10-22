"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sound {
    constructor() {
        window.AudioContext = window.AudioContext;
        this.context = new AudioContext();
        this.pan_node = new StereoPannerNode(this.context, { pan: 0 });
        this.gain_node = this.context.createGain();
    }
}
exports.Sound = Sound;
function loadSound(url, callback, sound) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    // Decode asynchronously
    request.onload = function () {
        sound.context.decodeAudioData(request.response, callback, (e) => console.log(e));
    };
    request.send();
}
exports.loadSound = loadSound;
function playSound(buffer, sound) {
    var source = sound.context.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.connect(sound.pan_node).connect(sound.gain_node).connect(sound.context.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source now
}
exports.playSound = playSound;
//# sourceMappingURL=Sound.js.map