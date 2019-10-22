"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sound_1 = require("./Sound");
const Graphics_1 = require("./Graphics");
const Input_1 = require("./Input");
const Map_1 = require("./Map");
var gameScreen;
var depth_buffer;
var current_frame;
var last_frame_time;
var fps;
function bootstrap() {
    console.log("Hello World");
    console.log("Game");
    var sound = new Sound_1.Sound();
    var dogBarkingBuffer;
    gameScreen = new Graphics_1.GameScreen("viewport", 4);
    depth_buffer = new Graphics_1.DepthBuffer(screen.width, screen.height);
    // let mySound = new sound("audio/bassdrum.mp3");
    Sound_1.loadSound("audio/song.mp3", (buffer) => {
        dogBarkingBuffer = buffer;
        setTimeout(function () {
            sound.context.resume();
            Sound_1.playSound(dogBarkingBuffer, sound);
        }, 2000);
    }, sound);
    current_frame = 0;
    init();
    last_frame_time = Date.now();
    fps = 0;
    mainLoop(0);
}
exports.bootstrap = bootstrap;
function init() {
    Input_1.initialiseInput();
    Map_1.initialiseMap(screen);
}
function update(tframe) {
    Input_1.updateInput();
    // Audio requires user interaction first
    // sound.pan_node.pan.value = Math.sin(tframe / 1000);
    // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)
    // if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
    //     console.log("update - ", sound.pan_node.pan.value);
    // }
}
function draw(tframe) {
    // Create the image
    Graphics_1.createImage(gameScreen, depth_buffer);
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
//# sourceMappingURL=Game.js.map