

function loadSound(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, callback, (e) => console.log(e));
    }
    request.send();
}

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(gainNode).connect(panner).connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
}


