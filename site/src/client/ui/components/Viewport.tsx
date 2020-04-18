import React = require("react");

export interface ViewportProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Viewport extends React.Component<ViewportProps> {
    public render() {
        return (
            <div
                style={{
                    maxWidth: this.props.width,
                    maxHeight: this.props.height,
                    width: this.props.width,
                    height: this.props.height,
                    overflow: "hidden",
                    marginLeft: this.props.x,
                    marginTop: this.props.y,
                    // borderStyle: "solid",
                    // borderColor: "#3e2731",
                    position: "absolute",
                }}
            >
                <div
                    style={{
                        transform: `translate(-${this.props.x}px, -${this.props.y}px)`,
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
