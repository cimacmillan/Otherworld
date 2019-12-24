import React = require("react");
import { CanvasComponent } from "./render"
import { ScreenBuffer, DepthBuffer, createImage } from "./render";
import { loadSound, Sound, playSound } from "./util/sound/Sound";
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

    private gameState: GameState;
    
    public componentDidMount() {
        this.initState();
    }

    private initState = () => {
        initialiseInput();

        const screen = new ScreenBuffer(
            (this.refs.main_canvas as CanvasComponent).getImageData(),
            WIDTH,
            HEIGHT
        );

        const depthBuffer = new DepthBuffer(
            WIDTH, HEIGHT
        );

        const sound = new Sound();

        const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);

        this.gameState = {
            loop, 
            world: {
                map: initialiseMap(),
                camera: initialiseCamera(screen),
            },
            audio: {
                sound
            },
            render: {
                screen,
                depthBuffer
            }
        }

        loadSound("audio/intro.mp3", (buffer) => {
            setTimeout(
                () => {
                this.gameState.audio.sound.context.resume();
                playSound(buffer, this.gameState.audio.sound);
            }, 2000);
        }, this.gameState.audio.sound);

        this.gameState.loop.start();
    }

    private update = () => {
        updateInput(this.gameState.world.camera);
    }

    private draw = () => {
        // Create the image
        createImage(this.gameState.render, this.gameState.world);
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
