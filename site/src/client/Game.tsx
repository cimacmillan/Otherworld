import { Sound, loadSound, playSound } from "./Sound";
import { DepthBuffer, GameScreen, createImage } from "./Graphics";
import { initialiseInput, updateInput } from "./Input";
import { initialiseMap } from "./Map";

var gameScreen: GameScreen;
var depth_buffer: DepthBuffer;
var current_frame: number;
var last_frame_time: number;
var fps: number;

export function bootstrap() {
    console.log("Hello World");
    console.log("Game");

    var sound = new Sound();
    var dogBarkingBuffer: AudioBuffer;

    gameScreen = new GameScreen("viewport", 4);
    depth_buffer = new DepthBuffer(screen.width, screen.height);

    // let mySound = new sound("audio/bassdrum.mp3");
    loadSound("audio/song.mp3", (buffer) => {
        dogBarkingBuffer = buffer;

        setTimeout(function () {
            sound.context.resume();
            playSound(dogBarkingBuffer, sound);
        }, 2000);
    }, sound);

    current_frame = 0;

    init();

    last_frame_time = Date.now();
    fps = 0;

    mainLoop(0)
}


function init() {
    initialiseInput();
    initialiseMap(screen);
}

function update(tframe: number) {

    updateInput();

    // Audio requires user interaction first
    // sound.pan_node.pan.value = Math.sin(tframe / 1000);
    // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)

    // if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
    //     console.log("update - ", sound.pan_node.pan.value);
    // }

}

function draw(tframe: number) {
    // Create the image
    createImage(gameScreen, depth_buffer);

    // Draw the image data to the canvas
    gameScreen.render_to_canvas();
}


function mainLoop(tframe: number) {

    let delta = Date.now() - last_frame_time;
    if (delta >= 1000) {
        console.log("FPS: ", fps)
        fps = 0;
        last_frame_time = Date.now();
    } else {
        fps++;
    }

    update(tframe);
    draw(tframe);
    requestAnimationFrame(mainLoop);

    current_frame += 1;
}
