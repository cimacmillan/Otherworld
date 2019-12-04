import React = require("react");
import { CanvasComponent } from "./render"
import { GameScreen, DepthBuffer, createImage } from "./render/Graphics";
import { loadSound, Sound, playSound } from "./Sound";
import { initialiseInput, updateInput } from "./Input";
import { initialiseMap } from "./Map";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

export class GameComponent extends React.Component {

    private gameScreen: GameScreen;
    private depthBuffer: DepthBuffer;
    private dogBarkingBuffer: AudioBuffer;
    private sound: Sound;

    private last_frame_time: number;
    private fps: number;
    
    public componentDidMount() {
        this.gameScreen = new GameScreen(
            (this.refs.main_canvas as CanvasComponent).getImageData(),
            WIDTH,
            HEIGHT
        );
        this.depthBuffer = new DepthBuffer(
            WIDTH, HEIGHT
        );

        this.sound = new Sound();

        loadSound("audio/intro.mp3", (buffer) => {
            this.dogBarkingBuffer = buffer;
            console.log("Loaded");
            setTimeout(
                () => {
                this.sound.context.resume();
                playSound(this.dogBarkingBuffer, this.sound);
            }, 2000);
        }, this.sound);


        this.init();

        this.last_frame_time = Date.now();
        this.fps = 0;

        this.mainLoop(0);
    }


    private init = () => {
        initialiseInput();
        initialiseMap(this.gameScreen);
    }

    private update = (tframe: number) => {

        updateInput();

        // Audio requires user interaction first
        // sound.pan_node.pan.value = Math.sin(tframe / 1000);
        // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)

        // if(current_frame % 20 == 0 && (tyspeof dogBarkingBuffer !== 'undefined')) {
        //     console.log("update - ", sound.pan_node.pan.value);
        // }

    }

    private draw = () => {
        // Create the image
        createImage(this.gameScreen, this.depthBuffer);
        // Draw the image data to the canvas
        (this.refs.main_canvas as CanvasComponent).writeImageData();
    }


    private mainLoop = (tframe: number) => {
        let delta = Date.now() - this.last_frame_time;
        if (delta >= 1000) {
            console.log("FPS: ", this.fps)
            this.fps = 0;
            this.last_frame_time = Date.now();
        } else {
            this.fps++;
        }

        this.update(tframe);
        this.draw();
        requestAnimationFrame(this.mainLoop);
    }


    public render() {
        return <CanvasComponent ref="main_canvas" id={"main_canvas"} dom_width={DOM_WIDTH} dom_height={DOM_HEIGHT} width={WIDTH} height={HEIGHT} resolution={RES_DIV}/>
    }

}
