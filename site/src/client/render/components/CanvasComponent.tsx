
import * as React from "react";

export interface CanvasComponentProps {
    id: string;
    resolution: number;
    dom_width: number;
    dom_height: number;
    width: number;
    height: number;
}

export class CanvasComponent extends React.Component<CanvasComponentProps> {

    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private imageData: ImageData;

    // Draws the canvas object to the screen, not actual pixels
    public render() {
        return <canvas ref="canvas" id={this.props.id} width={this.props.dom_width} height={this.props.dom_height}/>
    }

    // Gets the image data from the canvas object
    public componentDidMount() {
        this.canvas = this.refs.canvas as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');
        this.imageData = this.canvasContext.createImageData(this.props.width, this.props.height);
        this.canvasContext.imageSmoothingEnabled = false;
    }

    // Public getter for the image data reference (not very react)
    public getImageData = () => {
        return this.imageData;
    }

    // Public call to write the image data to the screen
    public writeImageData = () => {
        this.canvasContext.putImageData(this.imageData, 0, 0);
        this.canvasContext.drawImage(this.canvas, 0, 0, this.props.dom_width * this.props.resolution, this.props.dom_height * this.props.resolution);
    }

}
