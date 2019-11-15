"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const render_1 = require("./render");
const Graphics_1 = require("./render/Graphics");
const Sound_1 = require("./Sound");
const Input_1 = require("./Input");
const Map_1 = require("./Map");
const DOM_WIDTH = 640;
const DOM_HEIGHT = 480;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;
class GameComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.init = () => {
            Input_1.initialiseInput();
            Map_1.initialiseMap(screen);
        };
        this.update = (tframe) => {
            Input_1.updateInput();
            // Audio requires user interaction first
            // sound.pan_node.pan.value = Math.sin(tframe / 1000);
            // sound.gain_node.gain.value = Math.abs(sound.pan_node.pan.value)
            // if(current_frame % 20 == 0 && (typeof dogBarkingBuffer !== 'undefined')) {
            //     console.log("update - ", sound.pan_node.pan.value);
            // }
        };
        this.draw = () => {
            // Create the image
            Graphics_1.createImage(this.gameScreen, this.depthBuffer);
            // Draw the image data to the canvas
            this.refs.main_canvas.writeImageData();
        };
        this.mainLoop = (tframe) => {
            let delta = Date.now() - this.last_frame_time;
            if (delta >= 1000) {
                console.log("FPS: ", this.fps);
                this.fps = 0;
                this.last_frame_time = Date.now();
            }
            else {
                this.fps++;
            }
            this.update(tframe);
            this.draw();
            requestAnimationFrame(this.mainLoop);
        };
    }
    componentDidMount() {
        this.gameScreen = new Graphics_1.GameScreen(this.refs.main_canvas.getImageData(), WIDTH, HEIGHT);
        this.depthBuffer = new Graphics_1.DepthBuffer(WIDTH, HEIGHT);
        Sound_1.loadSound("audio/song.mp3", (buffer) => {
            this.dogBarkingBuffer = buffer;
            console.log("Loaded");
            setTimeout(() => {
                this.props.sound.context.resume();
                Sound_1.playSound(this.dogBarkingBuffer, this.props.sound);
            }, 2000);
        }, this.props.sound);
        this.init();
        this.last_frame_time = Date.now();
        this.fps = 0;
        this.mainLoop(0);
    }
    render() {
        return React.createElement(render_1.CanvasComponent, { ref: "main_canvas", id: "main_canvas", dom_width: DOM_WIDTH, dom_height: DOM_HEIGHT, width: WIDTH, height: HEIGHT });
    }
}
exports.GameComponent = GameComponent;
//# sourceMappingURL=GameComponent.js.map