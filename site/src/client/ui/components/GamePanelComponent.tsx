import React = require("react");

export interface GamePanelComponentProps {
    cellWidth: number;
    cellHeight: number;
    style: React.CSSProperties;
}

export class GamePanelComponent extends React.PureComponent<
    GamePanelComponent
> {
    public render() {
        return (
            <div>
                {/* Images for the panel */}
                {/* Viewport & children*/}
            </div>
        );
    }
}
