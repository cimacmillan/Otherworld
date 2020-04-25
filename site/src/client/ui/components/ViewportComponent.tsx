import React = require("react");

export interface ViewportProps {
    x: number;
    y: number;
    width: number;
    height: number;
    style: React.CSSProperties;
}

export const ViewportComponent: React.FunctionComponent<ViewportProps> = (
    props
) => {
    return (
        <div
            style={{
                maxWidth: props.width,
                maxHeight: props.height,
                width: props.width,
                height: props.height,
                overflow: "hidden",
                marginLeft: props.x,
                marginTop: props.y,
                position: "absolute",
                ...props.style,
            }}
        >
            {props.children}
        </div>
    );
};
