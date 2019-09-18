/*
TODO loading screen with audios / images
TODO start button to allow audio to start
TODO general structure for screens of varying behaviour
*/
console.log("Game");

var context;
// Get the canvas and context
var canvas = document.getElementById("viewport"); 
var canvas_context = canvas.getContext("2d");


// Define the image dimensions
var width = canvas.width;
var height = canvas.height;

// Create an ImageData object
var imagedata = canvas_context.createImageData(width, height);

function createImage(offset) {
    // Loop over all of the pixels
    for (var x=0; x<width; x++) {
        for (var y=0; y<height; y++) {
            // Get the pixel index
            var pixelindex = (y * width + x) * 4;

            // Generate a xor pattern with some random noise
            var red = ((x+offset) % 256) ^ ((y+offset) % 256);
            var green = ((2*x+offset) % 256) ^ ((2*y+offset) % 256);
            var blue = 50 + Math.floor(Math.random()*100);

            // Rotate the colors
            blue = (blue + offset) % 256;

            // Set the pixel data
            imagedata.data[pixelindex] = red;     // Red
            imagedata.data[pixelindex+1] = green; // Green
            imagedata.data[pixelindex+2] = blue;  // Blue
            imagedata.data[pixelindex+3] = 255;   // Alpha
        }
    }
}

function loadDogSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
        dogBarkingBuffer = buffer;
        }, (e) => console.log(e));
    }
    request.send();
}

var pannerOptions;
var panner;
var gainNode;

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(gainNode).connect(panner).connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
}

try {
// Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    pannerOptions = {pan: 0};
    panner = new StereoPannerNode(context, pannerOptions);
    gainNode = context.createGain();

}
catch(e) {
    alert('Web Audio API is not supported in this browser');
}

// let mySound = new sound("audio/bassdrum.mp3");
loadDogSound("audio/bassdrum.mp3");

var current_frame = 0;


function update(tframe) {

    // Audio requires user interaction first
    panner.pan.value = Math.sin(tframe / 1000);
    gainNode.gain.value = Math.abs(panner.pan.value)

    if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
        console.log("update - ", panner.pan.value);
        context.resume();
        playSound(dogBarkingBuffer);
        // mySound.play();
    }

}

function draw(tframe) {
    // Create the image
    createImage(Math.floor(tframe / 10));

    // Draw the image data to the canvas
    canvas_context.putImageData(imagedata, 0, 0);
}

function mainLoop(tframe) {
    update(tframe);
    draw(tframe);
    requestAnimationFrame(mainLoop);

    current_frame += 1;
}
 

mainLoop(0)
// Start things off
// requestAnimationFrame(mainLoop);