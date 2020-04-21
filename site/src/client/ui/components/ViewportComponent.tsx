import React = require("react");

export interface ViewportProps {
    x: number;
    y: number;
    width: number;
    height: number;
    style: React.CSSProperties;
}

export class ViewportComponent extends React.Component<ViewportProps> {
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
                    position: "absolute",
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
