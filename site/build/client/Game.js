"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Hello World");
console.log("Game");
var gameScreen = new GameScreen("viewport", 4);
var depth_buffer = new DepthBuffer(screen.width, screen.height);
var sound = new Sound();
var dogBarkingBuffer;
// let mySound = new sound("audio/bassdrum.mp3");
loadSound("audio/song.mp3", (buffer) => {
    dogBarkingBuffer = buffer;
    setTimeout(function () {
        sound.context.resume();
        playSound(dogBarkingBuffer, sound);
    }, 2000);
}, sound);
var current_frame = 0;
function init() {
    initialiseInput();
    initialiseMap(screen);
}
function update(tframe) {
    updateInput();
    // Audio requires user interaction first
    // sound.pan_node.pan.value = Math.sin(tframe / 1000);
    // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)
    // if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
    //     console.log("update - ", sound.pan_node.pan.value);
    // }
}
function draw(tframe) {
    // Create the image
    createImage(gameScreen, depth_buffer);
    // Draw the image data to the canvas
    gameScreen.render_to_canvas();
}
function mainLoop(tframe) {
    let delta = Date.now() - last_frame_time;
    if (delta >= 1000) {
        console.log("FPS: ", fps);
        fps = 0;
        last_frame_time = Date.now();
    }
    else {
        fps++;
    }
    update(tframe);
    draw(tframe);
    requestAnimationFrame(mainLoop);
    current_frame += 1;
}
exports.mainLoop = mainLoop;
init();
var last_frame_time = Date.now();
var fps = 0;
mainLoop(0);
// Start things off
// requestAnimationFrame(mainLoop);
//# sourceMappingURL=Game.js.map