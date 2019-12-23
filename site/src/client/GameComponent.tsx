import React = require("react");
import { CanvasComponent } from "./render"
import { ScreenBuffer, DepthBuffer, createImage } from "./render";
import { loadSound, Sound, playSound } from "./Sound";
import { initialiseInput, updateInput } from "./Input";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";
import { setFPSProportion, logFPS} from "./util/time/GlobalFPSController";
import { GameState } from "./state/GameState";
import { initialiseCamera, initialiseMap } from "./util/loader/MapLoader";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

const TARGET_FPS = 60;
const TARGET_MILLIS = Math.floor(1000 / TARGET_FPS);

export class GameComponent extends React.Component {

    private gameLoop: TimeControlledLoop;
    private gameScreen: ScreenBuffer;
    private depthBuffer: DepthBuffer;
    private dogBarkingBuffer: AudioBuffer;
    private sound: Sound;

    private gameState: GameState;
    
    public componentDidMount() {
        this.gameScreen = new ScreenBuffer(
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

        this.gameLoop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);
        this.gameLoop.start();
    }


    private init = () => {
        initialiseInput();

        this.gameState = {
            world: {
                map: initialiseMap(),
                camera: initialiseCamera(this.gameScreen)
            }
        }
    }

    private update = () => {
        updateInput(this.gameState.world.camera);
    }

    private draw = () => {
        // Create the image
        createImage(this.gameScreen, this.depthBuffer, this.gameState.world.map, this.gameState.world.camera);
        // Draw the image data to the canvas
        (this.refs.main_canvas as CanvasComponent).writeImageData();
    }


    private mainLoop = (instance: TimeControlledLoop, actualMilliseconds: number, actualProportion?: number) => {
        logFPS();
        setFPSProportion(1 / actualProportion);

        this.update();
        this.draw();
    }

    public render() {
        return <CanvasComponent ref="main_canvas" id={"main_canvas"} dom_width={DOM_WIDTH} dom_height={DOM_HEIGHT} width={WIDTH} height={HEIGHT} resolution={RES_DIV}/>
    }

}
