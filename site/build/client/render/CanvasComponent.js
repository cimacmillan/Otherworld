"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class CanvasComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.getImageData = () => {
            return this.imageData;
        };
        this.writeImageData = () => {
            this.canvasContext.putImageData(this.imageData, 0, 0);
            this.canvasContext.drawImage(this.canvas, 0, 0, this.props.dom_width * 4, this.props.dom_height * 4);
        };
        this.componentDidMount = () => {
            this.canvas = this.refs.canvas;
            this.canvasContext = this.canvas.getContext('2d');
            this.imageData = this.canvasContext.createImageData(this.props.width, this.props.height);
            this.canvasContext.imageSmoothingEnabled = false;
        };
        this.render = () => {
            return React.createElement("canvas", { ref: "canvas", id: this.props.id, width: this.props.dom_width, height: this.props.dom_height });
        };
    }
}
exports.CanvasComponent = CanvasComponent;
//# sourceMappingURL=CanvasComponent.js.map