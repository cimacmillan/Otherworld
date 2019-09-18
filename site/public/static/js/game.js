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

var pannerOptions;
var panner;
var gainNode;

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
loadSound("audio/song.mp3", (buffer) => {
    dogBarkingBuffer = buffer;

    setTimeout(function(){
        context.resume();
        playSound(dogBarkingBuffer);
    }, 2000);
});

var current_frame = 0;


function update(tframe) {

    // Audio requires user interaction first
    panner.pan.value = Math.sin(tframe / 1000);
    gainNode.gain.value = Math.abs(panner.pan.value)

    if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
        console.log("update - ", panner.pan.value);
        // context.resume();
        // playSound(dogBarkingBuffer);
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