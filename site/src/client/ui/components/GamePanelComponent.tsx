import React = require("react");
import { TextComponent } from "./Text";

export interface GamePanelComponentProps {
    cellWidth: number;
    cellHeight: number;
    style: React.CSSProperties;
}

export class GamePanelComponent extends React.PureComponent<
    GamePanelComponentProps
> {
    public render() {
        return (
            <div style={this.props.style}>
                <TextComponent text={"Otherworld"} />
                {/* Images for the panel */}
                {/* Viewport & children*/}
            </div>
        );
    }
}
